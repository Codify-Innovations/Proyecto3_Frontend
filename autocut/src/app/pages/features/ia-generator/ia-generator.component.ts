import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../core/services/alert.service';
import { IaService } from '../../../core/services/ia/ia.service';
import { UploaderService } from '../../../core/services/cloudinary/uploader.service';

@Component({
  selector: 'app-ia-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ia-generator.component.html',
})
export class IaGeneratorComponent {
  alertService = inject(AlertService);
  iaService = inject(IaService);
  uploaderService = inject(UploaderService);

  URLs: string[] = [];
  selectedStyle: string = 'showcase';
  durationPerImage: number = 3;
  videoUrl?: string;
  musicUrl: string | null = null;
  loading = false;

  get durationLabel(): string {
    if (this.durationPerImage <= 2) return 'Rápido ⚡';
    if (this.durationPerImage <= 4) return 'Normal 🎞️';
    if (this.durationPerImage <= 7) return 'Lento 🎬';
    return 'Muy lento 💤';
  }

  constructor() {
    effect(() => {
      if (this.uploaderService.uploaded$()) {
        const urls = this.uploaderService.urlSignal$();
        if (urls?.length > 0) {
          this.URLs = urls;
          console.log('📸 Archivos cargados desde Cloudinary:', this.URLs);
        }
      }
    });
  }

  async generateVideo() {
    console.log('🚀 Ejecutando generateVideo()');

    if (this.URLs.length === 0) {
      this.alertService.displayAlert(
        'error',
        '⚠️ No hay archivos cargados.',
        'center',
        'top',
        ['error-snackbar']
      );
      return;
    }

    this.loading = true;
    this.videoUrl = undefined;

    try {
      const result = await this.iaService.generateVideo(
        this.URLs,
        this.selectedStyle,
        this.durationPerImage,
        this.musicUrl ?? undefined
      );

      console.log('✅ Respuesta backend:', result);

      if (result?.video_url) {
        this.videoUrl = result.video_url;
        this.alertService.displayAlert(
          'success',
          '🎬 Video generado correctamente.',
          'center',
          'top',
          ['success-snackbar']
        );
      } else {
        throw new Error('Respuesta incompleta del backend.');
      }

    } catch (error) {
      console.error('❌ Error al generar video:', error);
      this.alertService.displayAlert(
        'error',
        'Ocurrió un error al generar el video.',
        'center',
        'top',
        ['error-snackbar']
      );
    } finally {
      this.loading = false;
    }
  }
}
