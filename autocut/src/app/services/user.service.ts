import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ISearch, IUser } from '../core/interfaces';
import { Observable, of } from 'rxjs'; // ✅ agregado "of" para mock opcional
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<IUser> {
  protected override source: string = 'users';
  private userListSignal = signal<IUser[]>([]);

  get users$() {
    return this.userListSignal;
  }

  public search: ISearch = {
    page: 1,
    size: 5,
  };

  public totalItems: any = [];
  private alertService: AlertService = inject(AlertService);

  // Función para obtener los datos del perfil del usuario
  getUserProfile(): Observable<IUser> {
    return this.http.get<IUser>(`${this.source}/profile`);
  }

  // Función para actualizar los datos del perfil del usuario
  updateUserProfile(user: IUser): Observable<any> {
    return this.http.put(`${this.source}/profile`, user);
  }

  // obtener colecciones del usuario
  getUserCollections(): Observable<any[]> {
    // Puedes cambiar la URL cuando tengas el endpoint real
    return this.http.get<any[]>(`${this.source}/collections`);

    
    /*
    return of([
      {
        id: 1,
        title: 'Modelos Clásicos',
        category: 'Vehículos',
        thumbnailUrl: 'https://cdn-icons-png.flaticon.com/512/7435/7435983.png',
      },
      {
        id: 2,
        title: 'Autos Concepto',
        category: 'Diseños 3D',
        thumbnailUrl: 'https://cdn-icons-png.flaticon.com/512/7435/7435961.png',
      },
    ]);
    */
  }

  // Otros métodos del servicio...
  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size }).subscribe({
      next: (response: any) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from(
          { length: this.search.totalPages ? this.search.totalPages : 0 },
          (_, i) => i + 1
        );
        this.userListSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('error', err);
      },
    });
  }

  getPrivacySetting(): Observable<any> {
    return this.http.get(`${this.source}/privacy`);
  }

  updatePrivacySetting(visibility: string): Observable<any> {
    return this.http.put(`${this.source}/privacy`, { visibility });
  }

  save(user: IUser) {
    this.add(user).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred adding the user', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      },
    });
  }

  update(user: IUser) {
    if (!user?.id) return;

    this.editCustomSource(`${user.id}`, user).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred updating the user', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      },
    });
  }

  delete(user: IUser) {
    if (!user?.id) return;

    this.delCustomSource(`${user.id}`).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred deleting the user', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      },
    });
  }
}
