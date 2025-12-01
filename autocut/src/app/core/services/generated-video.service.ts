import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { AlertService } from './alert.service';
import { AuthService } from '../../pages/features/auth/auth.service';
import { IGeneratedVideo, IGeneratedVideoPayload } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class GeneratedVideoService extends BaseService<IGeneratedVideo> {
  protected override source: string = 'api/ia/videos';

  private alertService = inject(AlertService);
  private authService = inject(AuthService);

  isSaving = signal<boolean>(false);
  get isSaving$() {
    return this.isSaving;
  }

  private savedVideo = signal<IGeneratedVideo | null>(null);
  get savedVideo$() {
    return this.savedVideo;
  }

  saveGeneratedVideo(payload: IGeneratedVideoPayload): void {
    const user = this.authService.getUser();

    if (!user || !user.id) {
      this.alertService.displayAlert(
        'error',
        'No se encontró información del usuario autenticado.',
        'center',
        'top'
      );
      return;
    }

    const body: IGeneratedVideo = {
      userId: user.id,
      imageUrls: JSON.stringify(payload.imageUrls),
      style: payload.style,
      duration: payload.duration,
      videoUrl: payload.videoUrl
    };

    this.isSaving.set(true);

    this.addCustomSource(`${user.id}`, body).subscribe({
      next: (response) => {
        this.isSaving.set(false);

        if (response && response.data) {
          this.savedVideo.set(response.data);
        } else {
          this.alertService.displayAlert(
            'error',
            'No se recibió una respuesta válida del servidor.',
            'center',
            'top'
          );
        }
      },

      error: (err) => {
        this.isSaving.set(false);
        this.savedVideo.set(null);

        const backendMessage =
          err?.error?.message || 'Error al registrar el video generado.';

        this.alertService.displayAlert(
          'error',
          backendMessage,
          'center',
          'top'
        );
      },
    });
  }
}
