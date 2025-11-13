import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from '../base-service';
import { AlertService } from '../alert.service';
import { IResponse } from '../../interfaces';

@Injectable({
  providedIn: 'root',
})
export class VehicleIdentificationService extends BaseService<any> {
  protected override source: string = 'http://127.0.0.1:8000/api';

  private alertService: AlertService = inject(AlertService);

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

    this.addCustomSource('vehicle_identification', { image_url: imageUrl }).subscribe({
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
        console.error('❌ Error en VehicleIaService:', err);
      },
    });
  }
}
