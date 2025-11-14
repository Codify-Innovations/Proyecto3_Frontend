import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';
import { googleAuthConfig } from '../../../core/config/auth.config';
import {
  IAuthority,
  ILoginResponse,
  IRoleType,
  IUser,
} from '../../../core/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private oauthService = inject(OAuthService);

  private accessToken!: string;
  private expiresIn!: number;
  private user: IUser = { email: '', authorities: [] };

  public currentUser = signal<IUser | null>(null);

  constructor() {
    // Solo configuración inicial, NO HTTP
    this.oauthService.configure(googleAuthConfig);
  }

  /** Inicializa OAuth2 y carga sesión desde localStorage */
  public async init(): Promise<void> {
    try {
      await this.oauthService.loadDiscoveryDocumentAndTryLogin();
      this.load();
    } catch (error) {
      console.warn('AuthService init error:', error);
    }
  }

  // ==========================================================
  // ================= AUTENTICACIÓN =========================
  // ==========================================================

  public login(credentials: {
    email: string;
    password: string;
  }): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('auth/login', credentials).pipe(
      tap((response) => {
        this.accessToken = response.token;
        this.expiresIn = response.expiresIn;
        this.user = response.authUser;
        this.currentUser.set(this.user);
        this.save();
      })
    );
  }

  public loginWithGoogle(idToken: string): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('auth/google', { idToken }).pipe(
      tap((response) => {
        this.accessToken = response.token;
        this.expiresIn = response.expiresIn;
        this.user = response.authUser;
        this.currentUser.set(this.user);
        this.save();
      })
    );
  }

  public async loginWithGooglePopup(): Promise<void> {
    try {
      await this.oauthService.loadDiscoveryDocument();
      const loginResult = await this.oauthService.tryLoginImplicitFlow();
      const idToken = this.oauthService.getIdToken();
      if (!idToken) throw new Error('No se obtuvo el ID Token de Google');
      await this.handleGoogleLoginResponse(idToken);
    } catch (error) {
      console.error('Error durante login con Google:', error);
      throw error;
    }
  }

  private async handleGoogleLoginResponse(idToken: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loginWithGoogle(idToken).subscribe({
        next: () => resolve(),
        error: (err) => reject(err),
      });
    });
  }

  public signup(user: IUser): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('auth/signup', user).pipe(
      tap((response) => {
        this.accessToken = response.token;
        this.expiresIn = response.expiresIn;
        this.user = response.authUser;
        this.save();
      })
    );
  }

  public logout(): void {
    this.accessToken = '';
    localStorage.removeItem('access_token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('auth_user');
    this.currentUser.set(null);
    try {
      this.oauthService.logOut();
    } catch (e) {
      console.warn('Error cerrando sesión con Google:', e);
    }
  }

  // ==========================================================
  // ================= SESIÓN LOCAL ==========================
  // ==========================================================

  public save(): void {
    localStorage.setItem('auth_user', JSON.stringify(this.user));
    if (this.accessToken)
      localStorage.setItem('access_token', JSON.stringify(this.accessToken));
    if (this.expiresIn)
      localStorage.setItem('expiresIn', JSON.stringify(this.expiresIn));
  }

  private load(): void {
    const token = localStorage.getItem('access_token');
    if (token) this.accessToken = JSON.parse(token);

    const exp = localStorage.getItem('expiresIn');
    if (exp) this.expiresIn = JSON.parse(exp);

    const user = localStorage.getItem('auth_user');
    if (user) {
      this.user = JSON.parse(user);
      this.currentUser.set(this.user);
    }
  }

  public getUser(): IUser | undefined {
    return this.user;
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public check(): boolean {
    if (!this.accessToken) return false;

    try {
      const { exp }: any = jwtDecode(this.accessToken);
      const now = Date.now() / 1000;
      if (exp < now) {
        this.logout();
        return false;
      }
      return true;
    } catch (e) {
      this.logout();
      return false;
    }
  }

  // ==========================================================
  // ================= ROLES ================================
  // ==========================================================

  public hasRole(role: string): boolean {
    return this.user.authorities?.some((a) => a.authority === role) ?? false;
  }

  public isSuperAdmin(): boolean {
    return (
      this.user.authorities?.some(
        (a) => a.authority === IRoleType.superAdmin
      ) ?? false
    );
  }

  public hasAnyRole(roles: any[]): boolean {
    return roles.some((role) => this.hasRole(role));
  }

  public getPermittedRoutes(routes: any[]): any[] {
    const permitted: any[] = [];
    for (const route of routes) {
      if (route.data?.authorities && this.hasAnyRole(route.data.authorities)) {
        permitted.unshift(route);
      }
    }
    return permitted;
  }

  public getUserAuthorities(): IAuthority[] | undefined {
    return this.user.authorities ?? [];
  }

  public areActionsAvailable(routeAuthorities: string[]): boolean {
    const userAuthorities = this.getUserAuthorities();
    const hasRole = routeAuthorities.some((ra) =>
      userAuthorities?.some((ua) => ua.authority === ra)
    );
    const isAdmin = userAuthorities?.some(
      (ua) =>
        ua.authority === IRoleType.admin ||
        ua.authority === IRoleType.superAdmin
    );
    return hasRole && !!isAdmin;
  }
}
