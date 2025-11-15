import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleViewerComponent } from '../components/viewer/vehicle-viewer.component';
import { ColorPickerComponent } from '../components/color-picker/color-picker.component';
import { WheelSelectorComponent } from '../components/selector/wheels/wheel-selector.component';
import { LightsSelectorComponent } from '../components/selector/lights/lights-selector.component';
import { GlassSelectorComponent } from '../components/selector/glass/glass-selector.component';
import { CarSelectorComponent } from '../components/selector/car/car-selector.component';
import { CarConfigs } from '../config/car-configs';
import { VehicleCustomizationService } from '../services/vehicle-customization.service';
import { IVehicleCustomization } from '../../../../core/interfaces';

@Component({
  selector: 'app-vehicle-customizer-page',
  standalone: true,
  imports: [
    CommonModule,
    VehicleViewerComponent,
    ColorPickerComponent,
    WheelSelectorComponent,
    LightsSelectorComponent,
    GlassSelectorComponent,
    CarSelectorComponent,
  ],
  templateUrl: './vehicle-customizer.page.html',
})
export class VehicleCustomizerPage implements OnInit {
  private customizationService = inject(VehicleCustomizationService);
  private cdr = inject(ChangeDetectorRef);

  selectedModel: keyof typeof CarConfigs = 'Nissan';
  bodyColor = '';
  glassTint = false;
  interiorColor = '';
  wheelStyle = '';
  frontLight = '';
  accessory = '';

  loaded = false;

  ngOnInit(): void {
    this.loadUserCustomization();
  }

  /** Cargar la configuración del usuario autenticado */
  private loadUserCustomization(): void {
    this.customizationService.getMyCustomization$().subscribe({
      next: (res: any) => {
        const config: IVehicleCustomization = res.data;

        if (config && config.modelo) {
          this.selectedModel = config.modelo as keyof typeof CarConfigs;
          this.bodyColor = config.carroceria || '';
          this.glassTint = !!config.vidriosPolarizados;
          this.interiorColor = config.interior || '';
          this.wheelStyle = config.rines || '';
          this.frontLight = config.lucesFront || '';

          console.log('Configuración previa cargada:', config);
        } else {
          this.selectedModel = 'Nissan';
          console.log('No se encontró configuración previa, cargando modelo estándar.');
        }

        this.loaded = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.warn('No se pudo cargar la configuración previa:', err);
        this.selectedModel = 'Nissan'; 
        this.loaded = true;
        this.cdr.detectChanges();
      },
    });
  }

  onCarSelected(modelId: keyof typeof CarConfigs): void {
    this.selectedModel = modelId;
  }

  onGlassChange(value: boolean): void {
    this.glassTint = value;
  }

  saveCustomization(): void {
    const customization: IVehicleCustomization = {
      modelo: this.selectedModel,
      carroceria: this.bodyColor,
      vidriosPolarizados: this.glassTint,
      interior: this.interiorColor,
      rines: this.wheelStyle,
      lucesFront: this.frontLight,
    };

    this.customizationService.saveCustomization(customization);
  }
}
