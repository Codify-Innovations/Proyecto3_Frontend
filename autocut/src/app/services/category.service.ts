import { inject, Injectable, signal } from '@angular/core';
import { ICategory, IResponse, ISearch } from '../core/interfaces';
import { BaseService } from './base-service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService<ICategory> {
  protected override source: string = 'categories';
  private categorySignal = signal<ICategory[]>([]);
  get categories$() {
    return this.categorySignal;
  }

  public search: ISearch = { page: 1, size: 5 };
  public totalItems: any = [];
  private alertService: AlertService = inject(AlertService);

  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size }).subscribe({
      next: (response: IResponse<ICategory[]>) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from(
          { length: this.search.totalPages ?? 0 },
          (_, i) => i + 1
        );
        this.categorySignal.set(response.data);
      },
      error: (err) => console.error('error', err)
    });
  }

  save(item: ICategory) {
    this.add(item).subscribe({
      next: (response: IResponse<ICategory>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: () => {
        this.alertService.displayAlert('error', 'Error adding category', 'center', 'top', ['error-snackbar']);
      }
    });
  }

  update(item: ICategory) {
    this.edit(item.id!, item).subscribe({
      next: (response: IResponse<ICategory>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: () => {
        this.alertService.displayAlert('error', 'Error updating category', 'center', 'top', ['error-snackbar']);
      }
    });
  }

  delete(item: ICategory) {
    this.del(item.id!).subscribe({
      next: (response: IResponse<ICategory>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: () => {
        this.alertService.displayAlert('error', 'Error deleting category', 'center', 'top', ['error-snackbar']);
      }
    });
  }
}
