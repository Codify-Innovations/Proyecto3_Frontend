import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../../core/services/alert.service';
import { FileUploaderComponent } from '../../../../components/shared/file-uploader/file-uploader.component';
import { UploaderService } from '../../../../core/services/cloudinary/uploader.service';
import { FormsModule } from '@angular/forms';
import { VehicleIdentificationService } from '../../../../core/services/ai/vehicle-identification.service';
import { validateSingleImage } from '../../../../core/utils/file-validator';
import { VehicleService } from '../../../../core/services/vehicle.service';

@Component({
  selector: 'app-vehicle-identification',
  imports: [CommonModule, FormsModule, FileUploaderComponent],
  templateUrl: './vehicle-identification.component.html',
})
export class VehicleIdentificationComponent {
  private alertService = inject(AlertService);
  private uploaderService = inject(UploaderService);
  private vehicleService = inject(VehicleService);
  public iaService = inject(VehicleIdentificationService);
  validateSingleImage = validateSingleImage;

  imageURL: string = '';
  currentYear = new Date().getFullYear();
  vehicleData = {
    marca: '',
    modelo: '',
    anio: '',
    categoria: '',
    imagenURL: '',
  };

  marcas: string[] = [];
  modelos: string[] = [];
  categorias: string[] = [];

  ngOnInit(): void {
    this.resetData();
    this.iaService.loadDropdowns();
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
          categoria: result.categoria || '',
          imagenURL: this.imageURL,
        };
        this.iaService.updateModelosYCategorias(result.marca);
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
    effect(() => {
      this.marcas = this.iaService.marcas$();
      this.modelos = this.iaService.modelos$();
      this.categorias = this.iaService.categorias$();
    });
  }

  onMarcaSeleccionada(marca: string): void {
    this.vehicleData.modelo = '';
    this.vehicleData.categoria = '';

    this.modelos = [];
    this.categorias = [];

    this.iaService.updateModelosYCategorias(marca);
  }

  onFilesSelected(files: File[]): void {
    if (!files.length) return;
    const file = files[0];

    this.uploaderService.uploadFiles([file], 'ai-identification-vehicles');
    this.iaService.isAnalyzing.set(true);
  }

  saveToCollection(): void {
    const { marca, modelo, anio, categoria, imagenURL } = this.vehicleData;

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
    });

    this.resetData();
    this.iaService.analysisResult$.set(null);
  }
}
