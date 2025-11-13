import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../../core/services/alert.service';
import { FileUploaderComponent } from '../../../../components/shared/file-uploader/file-uploader.component';
import { UploaderService } from '../../../../core/services/cloudinary/uploader.service';
import { FormsModule } from '@angular/forms';
import { VehicleIdentificationService } from '../../../../core/services/ai/vehicle-identification.service';
import { validateSingleImage } from '../../../../core/utils/file-validator';
import { VehicleService } from '../../../../core/services/vehicle.service';
import { VehicleCategory } from '../../../../core/enums/vehicle_category.enum';
import { VehicleColor } from '../../../../core/enums/vehicle_color.enum';
import { VehiclePreviewModalComponent } from '../vehicle-preview-modal/vehicle-preview-modal.component';
import { TranslateColorPipe } from '../../../../core/pipes/translate-color.pipe';

@Component({
  selector: 'app-vehicle-identification',
  imports: [
    CommonModule,
    FormsModule,
    FileUploaderComponent,
    VehiclePreviewModalComponent,
    TranslateColorPipe,
  ],
  templateUrl: './vehicle-identification.component.html',
})
export class VehicleIdentificationComponent {
  private alertService = inject(AlertService);
  private uploaderService = inject(UploaderService);
  private vehicleService = inject(VehicleService);
  public iaService = inject(VehicleIdentificationService);

  public categories = Object.values(VehicleCategory);
  public colors = Object.values(VehicleColor);

  validateSingleImage = validateSingleImage;

  imageURL: string = '';
  currentYear = new Date().getFullYear();
  showModal = false;

  vehicleData = {
    marca: '',
    modelo: '',
    anio: '',
    categoria: '',
    color: '',
    imagenURL: '',
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
      categoria: '',
      color: '',
      imagenURL: '',
    };
    this.imageURL = '';
  }
  private iaFilled = false;

  constructor() {
    effect(() => {
      const result = this.iaService.analysisResult$();
      if (result && !this.iaFilled) {
        this.iaFilled = true;
        this.vehicleData = {
          marca: result.marca || '',
          modelo: result.modelo || '',
          anio: result.año || '',
          categoria: this.isValidCategory(result.categoria)
            ? result.categoria
            : '',
          color: this.isValidColor(result.color)
            ? result.color.toLowerCase()
            : '',
          imagenURL: this.imageURL,
        };
      }
    });
    effect(() => {
      const urls = this.uploaderService.urlSignal$();
      if (urls && urls.length > 0 && this.iaService.isAnalyzing$()) {
        const imageUrl = urls[0];
        this.imageURL = imageUrl;
        this.iaFilled = false;
        this.iaService.analyzeVehicle(imageUrl);
      }
    });
  }

  onFilesSelected(files: File[]): void {
    if (!files.length) return;
    const file = files[0];

    this.uploaderService.uploadFiles([file], 'ai-identification-vehicles');
    this.iaService.isAnalyzing.set(true);
  }

  saveToCollection(): void {
    const { marca, modelo, anio, categoria, imagenURL, color } =
      this.vehicleData;

    if (!marca || !modelo) {
      this.alertService.displayAlert(
        'error',
        'Por favor identifica un vehículo antes de guardarlo.',
        'center',
        'top',
        ['error-snackbar']
      );
      return;
    }

    this.vehicleService.addVehicle({
      marca,
      modelo,
      anio,
      categoria,
      imagenURL,
      color,
    });

    console.log('📤 Vehículo a guardar:', {
      marca,
      modelo,
      anio,
      categoria,
      imagenURL,
      color,
    });

    this.resetData();
    this.iaService.analysisResult$.set(null);
  }

  private isValidColor(color: string): boolean {
    const lower = color.toLowerCase();
    return this.colors.map((c) => String(c).toLowerCase()).includes(lower);
  }

  private isValidCategory(category: string): boolean {
    if (!category) return false;
    const lower = category.toLowerCase();
    return this.categories.map((c) => String(c).toLowerCase()).includes(lower);
  }

  openPreview(): void {
    this.showModal = true;
  }

  closePreview(): void {
    this.showModal = false;
  }

  get isFormDisabled(): boolean {
    return !this.iaService.analysisResult$();
  }
}
