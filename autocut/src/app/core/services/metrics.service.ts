import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.example';
import { Observable } from 'rxjs';
import { IResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class MetricsService {

  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/metricas`;

  getSummary(userId: number): Observable<IResponse<any>> {
    return this.http.get<IResponse<any>>(
      `${this.baseUrl}/user/${userId}/summary`
    );
  }

  getMetricsByDateRange(
    userId: number,
    start: string,    // YYYY-MM-DD
    end: string       // YYYY-MM-DD
  ): Observable<IResponse<any>> {
    return this.http.get<IResponse<any>>(
      `${this.baseUrl}/user/${userId}/by-date`,
      {
        params: {
          start,
          end,
        },
      }
    );
  }
}
