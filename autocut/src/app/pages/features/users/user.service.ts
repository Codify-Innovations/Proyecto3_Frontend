import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from '../../../core/services/base-service';
import { ISearch, IUser } from '../../../core/interfaces/index';
import { Observable } from 'rxjs';
import { AlertService } from '../../../core/services/alert.service';

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

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.source}/profile`);
  }

  updateUserProfile(user: IUser): Observable<any> {
    return this.http.put(`${this.source}/profile`, user);
  }

  getUserCollections(): Observable<any[]> {
    return this.http.get<any[]>(`${this.source}/collections`);
  }

  getPublicProfile(valor: string): Observable<any> {
    return this.http.get<any>(`${this.source}/explore-users/${valor}`);
  }

  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size }).subscribe({
      next: (response: any) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from(
          { length: this.search.totalPages ? this.search.totalPages : 0 },
          (_, i) => i + 1
        );
        this.userListSignal.set(response.data);
      }
    });
  }

  searchUsers(params: any) {
    this.http.get(`${this.source}/search`, { params }).subscribe({
      next: (response: any) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from(
          { length: this.search.totalPages ? this.search.totalPages : 0 },
          (_, i) => i + 1
        );
        this.userListSignal.set(response.data);
      }
    });
  }
  save(user: IUser) {
    this.add(user).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      }
    });
  }

  update(user: IUser) {
    if (!user?.id) return;

    this.editCustomSource(`${user.id}`, user).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      }
    });
  }

  delete(user: IUser) {
    if (!user?.id) return;

    this.delCustomSource(`${user.id}`).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      }
    });
  }

  activate(id: number): Observable<any> {
    return this.http.put(`${this.source}/${id}/activate`, {});
  }

  deactivate(id: number): Observable<any> {
    return this.http.put(`${this.source}/${id}/deactivate`, {});
  }
}
