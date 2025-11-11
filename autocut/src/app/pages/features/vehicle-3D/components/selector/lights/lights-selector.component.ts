import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lights-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lights-selector.component.html',
})
export class LightsSelectorComponent {
  @Output() frontChange = new EventEmitter<string>();

  // Estilos disponibles
  lightStyles = ['Reset', 'Classic', 'LED', 'Xenon'];

  onChangeFront(event: Event) {
    this.frontChange.emit((event.target as HTMLSelectElement).value);
  }
}
