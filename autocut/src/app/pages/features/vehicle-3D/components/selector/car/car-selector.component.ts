import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarConfigs } from '../../../config/car-configs';

@Component({
  selector: 'app-car-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './car-selector.component.html',
})
export class CarSelectorComponent {
  @Output() carSelected = new EventEmitter<string>();

  // 🔹 Mapea directamente las propiedades del config
  cars = Object.entries(CarConfigs).map(([key, value]) => ({
    id: key,
    name: (value as any).displayName || key,
    logo: (value as any).logo
  }));

  selectedCar: any = null;

  selectCar(car: any) {
    this.selectedCar = car;
    this.carSelected.emit(car.id);
  }
}
