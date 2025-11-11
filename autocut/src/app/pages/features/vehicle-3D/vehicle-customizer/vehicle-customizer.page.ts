import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleViewerComponent } from '../components/viewer/vehicle-viewer.component';
import { ColorPickerComponent } from '../components/color-picker/color-picker.component';
import { WheelSelectorComponent } from '../components/selector/wheels/wheel-selector.component';
import { LightsSelectorComponent } from '../components/selector/lights/lights-selector.component';
import { GlassSelectorComponent } from '../components/selector/glass/glass-selector.component';
import { CarSelectorComponent } from '../components/selector/car/car-selector.component';
import { CarConfigs } from '../config/car-configs';

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
export class VehicleCustomizerPage {
  selectedModel: keyof typeof CarConfigs = 'Nissan';

  bodyColor = '';
  glassTint = false;
  interiorColor = '';
  wheelStyle = '';
  frontLight = '';
  accessory = '';

  onCarSelected(modelId: keyof typeof CarConfigs): void {
    this.selectedModel = modelId;
    console.log(`🚗 Modelo seleccionado: ${modelId}`);
  }

  onGlassChange(value: boolean): void {
    this.glassTint = value;
    console.log('🕶️ Vidrios polarizados:', value ? 'Sí' : 'No');
  }

  saveCustomization(): void {
    console.log('💾 Configuración guardada:', {
      modelo: this.selectedModel,
      carroceria: this.bodyColor,
      vidriosPolarizados: this.glassTint ? 'Sí' : 'No',
      interior: this.interiorColor,
      rines: this.wheelStyle,
      lucesFront: this.frontLight,
    });
  }
}
