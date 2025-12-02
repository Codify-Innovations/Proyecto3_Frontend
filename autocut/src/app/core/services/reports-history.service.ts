import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IResponse, IReporteHistorial } from '../interfaces';
import { LoggerService } from './utils/logger.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsHistoryService {

  private http = inject(HttpClient);
  private logger: LoggerService = inject(LoggerService);
  private readonly source = 'api/reportes/historial';

  historial = signal<IReporteHistorial[]>([]);
  loading = signal<boolean>(false);

  loadHistory() {
    this.loading.set(true);

    this.http.get<IResponse<IReporteHistorial[]>>(this.source).subscribe({
      next: res => {
        this.loading.set(false);
        this.historial.set(res.data ?? []);
      },
      error: err => {
        this.loading.set(false);
        this.logger.error('Error loading report history:', err);
      }
    });
  }
}
