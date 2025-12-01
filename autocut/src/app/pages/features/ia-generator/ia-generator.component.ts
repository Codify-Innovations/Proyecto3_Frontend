import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../core/services/alert.service';
import { UploaderService } from '../../../core/services/cloudinary/uploader.service';
import { FileUploaderComponent } from '../../../components/shared/file-uploader/file-uploader.component';
import { ShareButtonComponent } from '../../../components/shared/share/share-button.component';
import { VideoGeneratorService } from '../../../core/services/ai/video-generator.service';
import { GeneratedVideoService } from '../../../core/services/generated-video.service';

@Component({
  selector: 'app-ia-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploaderComponent, ShareButtonComponent],
  templateUrl: './ia-generator.component.html',
})
export class IaGeneratorComponent {

  alertService = inject(AlertService);
  iaService = inject(VideoGeneratorService);
  uploaderService = inject(UploaderService);
  generatedVideoService = inject(GeneratedVideoService);

  files: File[] = [];
  fileNames: string[] = [];
  URLs: string[] = [];

  selectedStyle = 'showcase';
  durationPerImage = 3;
  durationError: string | null = null;

  musicUrl: string | null = null;

  videoUrl?: string;
  loading = false;

  constructor() {
    effect(() => {
      const urls = this.uploaderService.urlSignal$();
      const uploaded = this.uploaderService.uploaded$();

      if (uploaded && urls && urls.length > 0) {
        console.log("📸 URLs recibidas desde Cloudinary:", urls);
        this.URLs = [...urls];
      }
    });
  }

  // ⭐ VALIDACIÓN DE DURACIÓN (1–99)
  validateDuration() {
    if (this.durationPerImage === null || this.durationPerImage === undefined) {
      this.durationError = "Debes ingresar un número entre 1 y 99.";
      return;
    }

    // Convertir a string para bloquear 3 dígitos
    const str = String(this.durationPerImage);

    // ❌ Si tiene más de 2 dígitos → recortar a 2
    if (str.length > 2) {
      this.durationPerImage = Number(str.slice(0, 2));
      this.durationError = "Máximo permitido: 20 segundos.";
      return;
    }

    // Validación numérica real
    const value = Number(this.durationPerImage);

    if (value < 1) {
      this.durationPerImage = 1;
      this.durationError = "El mínimo permitido es 1 segundo.";
      return;
    }

    if (value > 20) {
      this.durationPerImage = 20;
      this.durationError = "El máximo permitido es 20 segundos.";
      return;
    }

    this.durationError = null;
  }

  // VALIDACIÓN DE FORMATO DE AUDIO 🎵
  validateMusicUrl() {
    if (!this.musicUrl || this.musicUrl.trim() === "") return;

    const isValid = /\.(mp3|wav|m4a)$/i.test(this.musicUrl);

    if (!isValid) {
      this.alertService.displayAlert(
        'error',
        '❌ Solo se permiten URLs de música en formato .mp3, .wav o .m4a',
        'center',
        'top'
      );
      this.musicUrl = "";
    }
  }

  onFileUpload(files: File[]) {
    console.log("📥 Archivos seleccionados:", files);

    if (!files || files.length === 0) return;

    this.files = files;
    this.fileNames = files.map(f => f.name);

    this.uploaderService.uploadFiles(files, 'ai-video-generator');
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
    this.fileNames.splice(index, 1);
  }

  async generateVideo() {
    if (this.URLs.length === 0) {
      this.alertService.displayAlert(
        'error',
        '⚠️ Debes subir archivos primero.',
        'center',
        'top'
      );
      return;
    }

    if (this.durationError) {
      this.alertService.displayAlert(
        'error',
        '⚠️ Corrige la duración antes de continuar.',
        'center',
        'top'
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
        this.musicUrl
      );

      console.log("🎯 Respuesta del backend:", result);

      const url =
        result?.video_url ||
        result?.cloudinary_url ||
        result?.url;

      if (!url) throw new Error("No se recibió URL válida");

      this.videoUrl = url;

      this.alertService.displayAlert(
        'success',
        '🎬 Video generado correctamente.',
        'center',
        'top'
      );

      this.generatedVideoService.saveGeneratedVideo({
        imageUrls: this.URLs,
        style: this.selectedStyle,
        duration: this.durationPerImage,
        videoUrl: url
      });

    } catch (error) {
      console.error("❌ Error generando video:", error);
      this.alertService.displayAlert(
        'error',
        '❌ Error generando el video.',
        'center',
        'top'
      );
    }

    this.loading = false;
  }
}
