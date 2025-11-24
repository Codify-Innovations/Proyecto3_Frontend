import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { NotificationService } from '../../services/notificacion.service';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../../pages/features/auth/auth.service';

@Component({
  selector: 'app-notification-manager',
  templateUrl: './notification-manager.component.html'
})
export class NotificationManagerComponent implements OnInit, OnDestroy {

  private notisService = inject(NotificationService);
  private alertService = inject(AlertService);
  private authService = inject(AuthService);

  private pollingInterval: any;
  private userId: number = 0;

  ngOnInit(): void {
    const user = this.authService.getUser();

    if (!user || !user.id) return;

    this.userId = user.id;

    // Inicia el polling cada 5 segundos
    this.pollingInterval = setInterval(() => {
      this.checkNotifications();
    }, 5000);

    this.checkNotifications();
  }
  private checkNotifications(): void {

    this.notisService.getNoLeidas(this.userId).subscribe({
      next: (res) => {
        const notificaciones = res.data;
        notificaciones.forEach((n: any) => {

          this.alertService.displayAlert(
            'success',
            n.mensaje,
            'center',
            'top',
            ['success-snackbar']
          );

          this.notisService.marcarLeida(n.id).subscribe(() => {
            console.log('[NOTI] Notificación marcada como leída:', n.id);
          });
        });
      },
      error: (err) => {
        console.error('[NOTI] ERROR al obtener notificaciones:', err);
      }
    });
  }


  ngOnDestroy(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }
}
