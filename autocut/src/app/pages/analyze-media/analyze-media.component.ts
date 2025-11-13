import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { AlertService } from '../../core/services/alert.service';
import { AnalyzeMediaService } from '../../core/services/analyze-media.service';

@Component({
  selector: 'app-analyze-media',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './analyze-media.component.html',
})
export class AnalyzeMediaComponent {
  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);
  private aiService = inject(AnalyzeMediaService);

  form!: FormGroup;

  stepIndex = 0;

  selectedFile: File | null = null;
  analysisResult: any = null;
  loading = false;
  uploadProgress = 0;
  previewUrl: string | null = null;
  fileType: 'image' | 'video' | 'audio' | null = null;

  ngOnInit(): void {
    this.form = this.fb.group({
      file: [null],
    });
  }

  triggerFileInput() {
    document.getElementById('fileInput')?.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'video/mp4', 'audio/mpeg', 'audio/wav'];
    const maxSizeMB = 50;

    if (!validTypes.includes(file.type)) {
      this.alertService.error('Formato no válido. Solo JPG, PNG, MP4, MP3 o WAV.');
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      this.alertService.error('El archivo excede el tamaño máximo permitido (50 MB).');
      return;
    }

    this.selectedFile = file;
    this.form.patchValue({ file });

    if (file.type.startsWith('image/')) this.fileType = 'image';
    else if (file.type.startsWith('video/')) this.fileType = 'video';
    else if (file.type.startsWith('audio/')) this.fileType = 'audio';
    else this.fileType = null;

    const reader = new FileReader();
    reader.onload = (e: any) => (this.previewUrl = e.target.result);
    reader.readAsDataURL(file);
  }

  analyzeFile() {
    if (!this.selectedFile) {
      this.alertService.error('Selecciona un archivo primero.');
      return;
    }

    this.stepIndex = 1;
    this.loading = true;
    this.uploadProgress = 0;
    this.analysisResult = null;

    this.aiService.analyzeMedia(this.selectedFile).subscribe({
      next: (event) => {

   
        if (event.status === 'progress') {
        
          this.uploadProgress = event.progress >= 100 ? 99 : event.progress;
        }

 
        if (event.status === 'done') {
      
          this.uploadProgress = 100;

          const response = event.data;

          this.analysisResult = response.data;

          this.loading = false;
          this.stepIndex = 2;
        }
      },
      error: (err) => {
        this.alertService.error(err.message);
        this.loading = false;
        this.stepIndex = 0;
      }
    });
  }

  resetForm() {
    this.selectedFile = null;
    this.previewUrl = null;
    this.analysisResult = null;
    this.uploadProgress = 0;
    this.fileType = null;
    this.form.reset();
    this.stepIndex = 0;
  }
}
