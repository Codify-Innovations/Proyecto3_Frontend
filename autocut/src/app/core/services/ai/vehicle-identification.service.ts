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

  private dropdownData = signal<Record<string, any>>({});

  private marcas = signal<string[]>([]);
  private modelos = signal<string[]>([]);
  private categorias = signal<string[]>([]);

  get marcas$() {
    return this.marcas;
  }

  get modelos$() {
    return this.modelos;
  }

  get categorias$() {
    return this.categorias;
  }
  analyzeVehicle(imageUrl: string): void {
    this.isAnalyzing.set(true);

    this.addCustomSource('predict', { image_url: imageUrl }).subscribe({
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

  loadDropdowns(): void {
    this.findAllWithParamsAndCustomSource('dropdowns').subscribe({
      next: (response: IResponse<any>) => {
        const data = response as any;

        if (!data || Object.keys(data).length === 0) {
          throw new Error('El backend no devolvió datos de dropdowns.');
        }

        this.dropdownData.set(data);

        const marcas = Object.keys(data);
        this.marcas.set(marcas);
      },
      error: (err: any) => {
        console.error('❌ Error al cargar dropdowns:', err);
        this.alertService.displayAlert(
          'error',
          'No se pudieron cargar los datos de dropdowns.',
          'center',
          'top',
          ['error-snackbar']
        );
      },
    });
  }

  updateModelosYCategorias(marcaSeleccionada: string): void {
    const info = this.dropdownData()[marcaSeleccionada];
    if (info) {
      this.modelos.set(info.modelos || []);
      this.categorias.set(info.categorias || []);
    } else {
      this.modelos.set([]);
      this.categorias.set([]);
    }

    console.log('📦 Modelos:', this.modelos());
    console.log('🏷️ Categorías:', this.categorias());
  }
}
