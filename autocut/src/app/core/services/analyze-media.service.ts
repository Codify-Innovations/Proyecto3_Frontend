import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnalyzeMediaService {
  private apiUrl = `${environment.apiUrl}/api/media/analyze`;

  constructor(private http: HttpClient) {}

  analyzeMedia(file: File): Observable<any> {
    if (!file) {
      return throwError(() => new Error('No se ha seleccionado ningún archivo.'));
    }

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const isAudio = file.type.startsWith('audio/');

    if (!(isImage || isVideo || isAudio)) {
      return throwError(() =>
        new Error('Formato no válido. Solo se permiten imágenes, videos o audios.')
      );
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return throwError(() => new Error('El archivo excede el tamaño máximo permitido (50MB).'));
    }

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(this.apiUrl, formData, { observe: 'events', reportProgress: true }).pipe(
      map((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const progress = Math.round((100 * event.loaded) / (event.total ?? 1));
            return { status: 'progress', progress };

          case HttpEventType.Response:
            return { status: 'done', data: event.body };

          default:
            return event;
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'Error desconocido al analizar el archivo.';

    if (error.error instanceof ErrorEvent) {
      errorMsg = `Error del cliente: ${error.error.message}`;
    } else if (error.status === 400) {
      errorMsg = typeof error.error === 'string'
        ? error.error
        : 'Archivo no válido. Verifique el formato y tamaño.';
    } else if (error.status === 500) {
      errorMsg = typeof error.error === 'string'
        ? error.error
        : 'Error interno del servidor durante el análisis.';
    } else if (error.status === 0) {
      errorMsg = 'No se pudo conectar con el servidor. Verifique que el backend esté en ejecución.';
    }

    return throwError(() => new Error(errorMsg));
  }
}
