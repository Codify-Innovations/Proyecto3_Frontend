import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './color-picker.component.html',
})
export class ColorPickerComponent {
  @Input() label = '';
  @Input() color = '#ffffff';
  @Output() colorChange = new EventEmitter<string>();

  onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.colorChange.emit(input.value);
  }
}
