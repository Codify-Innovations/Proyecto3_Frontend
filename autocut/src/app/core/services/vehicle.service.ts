// src/app/core/services/vehicle/vehicle-registration.service.ts
import { inject, Injectable, signal } from '@angular/core';
import { IResponse } from '../interfaces';
import { IVehiculo } from '../interfaces';
import { BaseService } from './base-service';
import { AlertService } from './alert.service';
import { AuthService } from '../../pages/features/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class VehicleService extends BaseService<IVehiculo> {
  protected override source: string = 'api/vehiculos';

  private alertService = inject(AlertService);
  private authService = inject(AuthService);

  isSaving = signal<boolean>(false);
  get isSaving$() {
    return this.isSaving;
  }

  private savedVehicle = signal<IVehiculo | null>(null);
  get savedVehicle$() {
    return this.savedVehicle;
  }

  addVehicle(vehiculo: IVehiculo): void {
    const user = this.authService.getUser();
    if (!user || !user.id) {
      this.alertService.displayAlert(
        'error',
        'No se encontró información del usuario autenticado.',
        'center',
        'top',
        ['error-snackbar']
      );
      return;
    }

    this.isSaving.set(true);

    this.addCustomSource(`${user.id}`, vehiculo).subscribe({
      next: (response: IResponse<IVehiculo>) => {
        this.isSaving.set(false);

        if (response && response.data) {
          this.savedVehicle.set(response.data);
          this.alertService.displayAlert(
            'success',
            'Vehículo guardado correctamente.',
            'center',
            'top',
            ['success-snackbar']
          );
        } else {
          this.alertService.displayAlert(
            'error',
            'No se recibió una respuesta válida del servidor.',
            'center',
            'top',
            ['error-snackbar']
          );
        }
      },
      error: (err) => {
        this.isSaving.set(false);
        this.savedVehicle.set(null);
        const backendMessage =
          err?.error?.message || 'Error al registrar el vehículo.';
        this.alertService.displayAlert(
          'error',
          backendMessage,
          'center',
          'top',
          ['error-snackbar']
        );
        console.error('❌ Error en VehicleRegistrationService:', err);
      },
    });
  }
}
