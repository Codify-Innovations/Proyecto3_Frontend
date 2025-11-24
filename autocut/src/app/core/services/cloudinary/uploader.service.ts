import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from '../base-service';
import { AlertService } from '../alert.service';
import { IResponse } from '../../interfaces';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploaderService extends BaseService<any> {
  protected override source: string = 'api/files';
  private alertService: AlertService = inject(AlertService);

  isUploading = signal<boolean>(false);

  private uploaded = signal<any | null>(null);
  get uploaded$() {
    return this.uploaded;
  }

  private urlSignal = signal<string[]>([]);
  get urlSignal$() {
    return this.urlSignal;
  }

  uploadFiles(files: File[], folderName: string): void {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('folderName', folderName);

    this.urlSignal.set([]);
    this.isUploading.set(true);
    this.uploaded.set(false);

    this.addCustomSource('upload', formData).subscribe({
      next: (response: IResponse<any>) => {
        if (response.data && Array.isArray(response.data)) {
          this.urlSignal.set(response.data);
        }
        this.isUploading.set(false);
        this.uploaded.set(true);
      },
      error: (err: any) => {
        this.isUploading.set(false);
        this.uploaded.set(false);
        const backendMessage =
          err?.error?.detail || 'Error al subir los archivos.';

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

  async uploadBlob(
    blob: Blob,
    folderName: string,
    fileName: string
  ): Promise<string> {
    const formData = new FormData();
    formData.append('files', blob, fileName);
    formData.append('folderName', folderName);

    try {
      const response = await firstValueFrom(
        this.addCustomSource('upload', formData)
      );

      if (response.data && Array.isArray(response.data) && response.data.length) {
        return response.data[0];
      }

      throw new Error('No se recibió una URL válida del servicio de archivos.');
    } catch (err) {
      this.alertService.displayAlert(
        'error',
        'Error al subir la imagen generada.',
        'center',
        'top',
        ['error-snackbar']
      );
      throw err;
    }
  }
}
