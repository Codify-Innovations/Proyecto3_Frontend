import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IDateMetrics, IResponse, IUserSummary } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class MetricsService {

  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/metricas`;

  getSummary(userId: number): Observable<IResponse<IUserSummary>> {
    return this.http.get<IResponse<IUserSummary>>(
      `${this.baseUrl}/user/${userId}/summary`
    );
  }

  getMetricsByDateRange(
    userId: number,
    start: string,    // YYYY-MM-DD
    end: string       // YYYY-MM-DD
  ): Observable<IResponse<IDateMetrics>> {
    return this.http.get<IResponse<IDateMetrics>>(
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
