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
  // 🔧 Servicios
  alertService = inject(AlertService);
  iaService = inject(IaService);
  uploaderService = inject(UploaderService);

  // 🎛️ Variables principales
  URLs: string[] = [];
  selectedStyle = 'dynamic';
  durationPerImage = 3; // duración predeterminada en segundos
  videoUrl?: string;
  loading = false;

  // 💬 Texto dinámico de duración (para slider)
  get durationLabel(): string {
    if (this.durationPerImage <= 2) return 'Rápido ⚡';
    if (this.durationPerImage <= 4) return 'Normal 🎞️';
    if (this.durationPerImage <= 7) return 'Lento 🎬';
    return 'Muy lento 💤';
  }

  constructor() {
    // Si el uploader sube imágenes automáticamente
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

  // 🎬 Generar video con IA
  async generateVideo() {
    console.log('🚀 Ejecutando generateVideo()');
    console.log('URLs:', this.URLs);
    console.log('Estilo:', this.selectedStyle);
    console.log('Duración por imagen:', this.durationPerImage);

    // ⚠️ Validación básica
    if (this.URLs.length === 0) {
      this.alertService.displayAlert(
        'error',
        '⚠️ No hay imágenes cargadas para generar el video.',
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
        this.durationPerImage
      );

      console.log('✅ Respuesta backend:', result);

      if (result && (result.video_url || result.cloudinary_url)) {
        this.videoUrl = result.video_url || result.cloudinary_url;
        this.alertService.displayAlert(
          'success',
          '🎬 Video generado correctamente.',
          'center',
          'top',
          ['success-snackbar']
        );
      } else {
        throw new Error('El backend no devolvió una URL válida.');
      }
    } catch (error) {
      console.error('❌ Error al generar el video:', error);
      this.alertService.displayAlert(
        'error',
        'Ocurrió un error al generar el video. Intenta nuevamente.',
        'center',
        'top',
        ['error-snackbar']
      );
    } finally {
      this.loading = false;
    }
  }

  // 💾 Guardar el video
  saveVideo(videoUrl: string) {
    console.log('💾 Guardar video:', videoUrl);
    this.alertService.displayAlert(
      'success',
      '📁 Video guardado en tu cuenta correctamente.',
      'center',
      'top',
      ['success-snackbar']
    );
  }
}
