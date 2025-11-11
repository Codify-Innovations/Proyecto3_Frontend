import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wheel-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wheel-selector.component.html',
})
export class WheelSelectorComponent {
  @Output() wheelChange = new EventEmitter<string>();

  wheelStyles = ['Classic', 'Sport', 'Offroad'];

  onChange(event: Event) {
    this.wheelChange.emit((event.target as HTMLSelectElement).value);
  }
}
