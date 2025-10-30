import { inject, Injectable } from '@angular/core';
import { IAuthority, ILoginResponse, IResponse, IRoleType, IUser } from '../core/interfaces';
import { Observable, firstValueFrom, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken!: string;
  private expiresIn!: number;
  private user: IUser = { email: '', authorities: [] };
  private http: HttpClient = inject(HttpClient);

  constructor() {
    this.load();
  }

  // Guardar los datos en el localStorage
  public save(): void {
    if (this.user) localStorage.setItem('auth_user', JSON.stringify(this.user));
    if (this.accessToken) localStorage.setItem('access_token', JSON.stringify(this.accessToken));
    if (this.expiresIn) localStorage.setItem('expiresIn', JSON.stringify(this.expiresIn));
  }

  // Cargar los datos desde el localStorage
  private load(): void {
    let token = localStorage.getItem('access_token');
    if (token) this.accessToken = JSON.parse(token);
    let exp = localStorage.getItem('expiresIn');
    if (exp) this.expiresIn = JSON.parse(exp);
    const user = localStorage.getItem('auth_user');
    if (user) this.user = JSON.parse(user);
  }

  // Obtener el usuario actual
  public getUser(): IUser | undefined {
    return this.user;
  }

  // Obtener el token de acceso
  public getAccessToken(): string | null {
    return this.accessToken;
  }

  // Verificar si el usuario está autenticado
  public check(): boolean {
    return !!this.accessToken;
  }

  // Autenticación normal (con email y contraseña)
  public login(credentials: { email: string; password: string }): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('auth/login', credentials).pipe(
      tap((response: ILoginResponse) => {
        this.accessToken = response.token;
        this.user.email = credentials.email;
        this.expiresIn = response.expiresIn;
        this.user = response.authUser;
        this.save();
      })
    );
  }
  
  // Autenticación con Google (usando el idToken de Google)
  public loginWithGoogle(idToken: string): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('auth/google', { idToken }).pipe(
      tap((response: ILoginResponse) => {
        this.accessToken = response.token;
        this.expiresIn = response.expiresIn;
        this.user = response.authUser;
        this.save();
      })
    );
  }

  // Verificar si el usuario tiene un rol específico
  public hasRole(role: string): boolean {
    return this.user.authorities ? this.user?.authorities.some(authority => authority.authority == role) : false;
  }

  // Verificar si el usuario es un superadmin
  public isSuperAdmin(): boolean {
    return this.user.authorities ? this.user?.authorities.some(authority => authority.authority == IRoleType.superAdmin) : false;
  }

  // Verificar si el usuario tiene alguno de los roles proporcionados
  public hasAnyRole(roles: any[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  // Obtener las rutas permitidas según los roles del usuario
  public getPermittedRoutes(routes: any[]): any[] {
    let permittedRoutes: any[] = [];
    for (const route of routes) {
      if (route.data && route.data.authorities) {
        if (this.hasAnyRole(route.data.authorities)) {
          permittedRoutes.unshift(route);
        }
      }
    }
    return permittedRoutes;
  }

  // Registrar un nuevo usuario
  public signup(user: IUser): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('auth/signup', user);
  }

  // Cerrar sesión
  public logout() {
    this.accessToken = '';
    localStorage.removeItem('access_token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('auth_user');
  }

  // Obtener las autoridades del usuario
  public getUserAuthorities(): IAuthority[] | undefined {
    return this.getUser()?.authorities ? this.getUser()?.authorities : [];
  }

  // Verificar si las acciones están disponibles según las autoridades de la ruta
  public areActionsAvailable(routeAuthorities: string[]): boolean {
    let allowedUser: boolean = false;
    let isAdmin: boolean = false;

    let userAuthorities = this.getUserAuthorities();

    for (const authority of routeAuthorities) {
      if (userAuthorities?.some(item => item.authority == authority)) {
        allowedUser = userAuthorities?.some(item => item.authority == authority);
      }
      if (allowedUser) break;
    }

    if (userAuthorities?.some(item => item.authority == IRoleType.admin || item.authority == IRoleType.superAdmin)) {
      isAdmin = userAuthorities?.some(item => item.authority == IRoleType.admin || item.authority == IRoleType.superAdmin);
    }

    return allowedUser && isAdmin;
  }
}
