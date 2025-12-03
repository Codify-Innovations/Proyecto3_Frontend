import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from '../base-service';
import { AlertService } from '../alert.service';
import { IResponse } from '../../interfaces';
import { LoggerService } from '../utils/logger.service';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class VehicleIdentificationService {
  private apiBase = environment.iaApiUrl;
  private http = inject(HttpClient);
  private alertService: AlertService = inject(AlertService);
  private logger: LoggerService = inject(LoggerService);
  isAnalyzing = signal<boolean>(false);
  get isAnalyzing$() {
    return this.isAnalyzing;
  }

  private analysisResult = signal<any | null>(null);
  get analysisResult$() {
    return this.analysisResult;
  }

  analyzeVehicle(imageUrl: string): void {
    this.isAnalyzing.set(true);

    this.http.post<IResponse<any>>(
      `${this.apiBase}/vehicle_identification`,
      { image_url: imageUrl }
    ).subscribe({
      next: (response: IResponse<any>) => {
        this.isAnalyzing.set(false);

        if (response) {
          this.analysisResult.set(response);
          this.alertService.displayAlert(
            'success',
            'Vehículo identificado correctamente.',
            'center',
            'top',
            ['success-snackbar']
          );
        } else {
          this.alertService.displayAlert(
            'error',
            'No se obtuvo una respuesta válida del modelo.',
            'center',
            'top',
            ['error-snackbar']
          );
        }
      },
      error: (err: any) => {
        this.isAnalyzing.set(false);
        this.analysisResult.set(null);
        const backendMessage =
          err?.error?.detail || 'Error al analizar la imagen con IA.';
        this.alertService.displayAlert(
          'error',
          backendMessage,
          'center',
          'top',
          ['error-snackbar']
        );
        this.logger.error('Error en VehicleIaService:', err);
      },
    });
  }
}
