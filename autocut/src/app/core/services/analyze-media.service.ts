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


    const validFormats = ['video/mp4', 'audio/mpeg', 'audio/wav', 'image/jpeg', 'image/png'];
    const maxSize = 50 * 1024 * 1024; 

    if (!validFormats.includes(file.type)) {
      return throwError(() => new Error('Formato no válido. Solo se permiten MP4, MP3, WAV, JPG o PNG.'));
    }

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


