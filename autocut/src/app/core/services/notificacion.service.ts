import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INotificacion, IResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private http = inject(HttpClient);
  private apiUrl = 'api/notificaciones';

  getNoLeidas(userId: number): Observable<IResponse<INotificacion[]>> {
    return this.http.get<any>(`${this.apiUrl}/no-leidas/${userId}`);
  }

  marcarLeida(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/marcar-leida/${id}`, {});
  }
}
