import { inject, Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private snackBar = inject(MatSnackBar);

  displayAlert(
    type: 'success' | 'error' | 'info',
    message: string,
    horizontalPosition?: MatSnackBarHorizontalPosition,
    verticalPosition?: MatSnackBarVerticalPosition,
    panelClass?: string[]
  ): void {
    const finalMessage =
      !message && type === 'error'
        ? 'Ocurrió un error, inténtalo nuevamente.'
        : !message && type === 'success'
        ? 'Operación realizada correctamente.'
        : message;

    const cssClass =
      panelClass ??
      (type === 'success'
        ? ['success-snackbar']
        : type === 'error'
        ? ['error-snackbar']
        : ['info-snackbar']);

    this.snackBar.open(finalMessage, 'Cerrar', {
      horizontalPosition: horizontalPosition ?? 'center',
      verticalPosition: verticalPosition ?? 'top',
      panelClass: cssClass,
      duration: 3000,
    });
  }

  // 👇 Métodos simplificados que tu componente ya usa
  success(message: string): void {
    this.displayAlert('success', message);
  }

  error(message: string): void {
    this.displayAlert('error', message);
  }

  info(message: string): void {
    this.displayAlert('info', message);
  }

  // ======================================================
  // ✅ NUEVO MÉTODO — Manejo estándar de respuestas HTTP
  // ======================================================
  handleResponse(
    success: boolean,
    messageSuccess?: string,
    messageError?: string
  ): void {
    if (success) {
      this.displayAlert(
        'success',
        messageSuccess || 'Datos actualizados correctamente.',
        'center',
        'top',
        ['success-snackbar']
      );
    } else {
      this.displayAlert(
        'error',
        messageError || 'Error al procesar la solicitud.',
        'center',
        'top',
        ['error-snackbar']
      );
    }
  }
}
