import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from '../../../../core/services/base-service';
import { AlertService } from '../../../../core/services/alert.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { IVehicleCustomization } from '../../../../core/interfaces';

@Injectable({
  providedIn: 'root',
})
export class VehicleCustomizationService extends BaseService<IVehicleCustomization> {
  protected override source: string = 'vehicles/customizations';
  private alertService = inject(AlertService);
  private router = inject(Router);

  // Señal reactiva que almacena la configuración del usuario
  private customizationSignal = signal<IVehicleCustomization | null>(null);
  get customization$() {
    return this.customizationSignal;
  }

  /**
   * Guarda o actualiza la configuración del vehículo del usuario autenticado.
   * (POST /vehicles/customizations)
   */
saveCustomization(customization: IVehicleCustomization): void {
    this.add(customization).subscribe({
      next: (response: any) => {
        this.customizationSignal.set(response.data);

        this.alertService.displayAlert(
          'success',
          response.message || 'Configuración guardada correctamente.',
          'center',
          'top',
          ['success-snackbar']
        );

        // Redirigir al perfil después de guardar
        setTimeout(() => {
          this.router.navigate(['/app/profile']);
        }, 800); // pequeño delay opcional para que se vea la alerta
      },
      error: (err: any) => {
        console.error('Error guardando la configuración:', err);
        this.alertService.displayAlert(
          'error',
          'Ocurrió un error al guardar la configuración.',
          'center',
          'top',
          ['error-snackbar']
        );
      },
    });
  }



  /**
   * Obtiene la configuración del usuario autenticado.
   * (GET /vehicles/customizations/me)
   */
  loadMyCustomization(): void {
    this.getMyCustomization$().subscribe({
      next: (response: any) => {
        this.customizationSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('Error obteniendo la configuración del usuario:', err);
      },
    });
  }

  /**
   * Devuelve un observable directo por si se necesita en resolvers o guards.
   */
  getMyCustomization$(): Observable<any> {
    return this.http.get(`${this.source}/me`);
  }
}
