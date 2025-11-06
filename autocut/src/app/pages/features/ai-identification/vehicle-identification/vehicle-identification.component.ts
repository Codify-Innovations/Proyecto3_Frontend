import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../../core/services/alert.service';
import { FileUploaderComponent } from '../../../../components/shared/file-uploader/file-uploader.component';
import { UploaderService } from '../../../../core/services/cloudinary/uploader.service';
import { FormsModule } from '@angular/forms';
import { VehicleIdentificationService } from '../../../../core/services/ai/vehicle-identification.service';
import { validateSingleImage } from '../../../../core/utils/file-validator';

@Component({
  selector: 'app-vehicle-identification',
  imports: [CommonModule, FormsModule, FileUploaderComponent],
  templateUrl: './vehicle-identification.component.html',
})
export class VehicleIdentificationComponent {
  private alertService = inject(AlertService);
  private uploaderService = inject(UploaderService);
  public iaService = inject(VehicleIdentificationService);
  validateSingleImage = validateSingleImage;

  imagePreview: string | null = null;

  vehicleData = {
    marca: '',
    modelo: '',
    anio: '',
    confianza: 0,
    categoria: '',
  };

  ngOnInit(): void {
    this.resetData();
  }

  ngOnDestroy(): void {
    this.resetData();
    this.iaService.analysisResult$.set(null);
    this.iaService.isAnalyzing.set(false);
  }

  private resetData(): void {
    this.vehicleData = {
      marca: '',
      modelo: '',
      anio: '',
      confianza: 0,
      categoria: '',
    };
    this.imagePreview = null;
  }
  constructor() {
    effect(() => {
      const result = this.iaService.analysisResult$();
      if (result) {
        this.vehicleData = {
          marca: result.marca || '',
          modelo: result.modelo || '',
          anio: result.año || '',
          confianza: result.confianza || 0,
          categoria: result.categoria || '',
        };
      }
    });
    effect(() => {
      const urls = this.uploaderService.urlSignal$();
      if (urls && urls.length > 0 && this.iaService.isAnalyzing$()) {
        const imageUrl = urls[0];
        this.iaService.analyzeVehicle(imageUrl);
      }
    });
  }

  onFilesSelected(files: File[]): void {
    if (!files.length) return;
    const file = files[0];

    this.imagePreview = URL.createObjectURL(file);

    this.uploaderService.uploadFiles([file], 'ai-identification-vehicles');
    this.iaService.isAnalyzing.set(true);
  }

  saveToCollection(): void {
    this.alertService.success('Vehículo guardado en tu colección.');
  }
}
