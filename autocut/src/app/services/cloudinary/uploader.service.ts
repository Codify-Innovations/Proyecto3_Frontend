import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from '../base-service';
import { AlertService } from '../alert.service';
import { IResponse } from '../../core/interfaces';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UploaderService extends BaseService<any> {
  protected override source: string = 'api/files';
  private alertService: AlertService = inject(AlertService);

  isUploading = signal<boolean>(false);
  uploaded = signal<boolean>(false);

  private uploadSignal = signal<any | null>(null);
  get upload$() {
    return this.uploadSignal;
  }

  uploadFiles(files: File[], folderName: string): void {
    const formData = new FormData();

    files.forEach((file) => formData.append('files', file));
    formData.append('folderName', folderName);

    this.uploaded.set(false);
    this.isUploading.set(true);

    this.http
      .post<IResponse<any>>(`${this.source}/upload`, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .subscribe({
        next: (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.Response) {
            const response = event.body as IResponse<any>;
            this.alertService.displayAlert(
              'success',
              'Archivos subidos correctamente',
              'center',
              'top',
              ['success-snackbar']
            );
            this.uploadSignal.set(response.data);
            this.isUploading.set(false);
            this.uploaded.set(true);
          }
        },
        error: (err) => {
          this.isUploading.set(false);
          this.uploaded.set(false);
          let backendMessage =
            err?.error?.message ||
            err?.error?.detail ||
            err?.error?.error ||
            err?.message ||
            'Error al subir los archivos.';

          this.alertService.displayAlert(
            'error',
            backendMessage,
            'center',
            'top',
            ['error-snackbar']
          );
          console.error('❌ Error en upload:', err);
        },
      });
  }
}
