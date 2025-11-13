import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-glass-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './glass-selector.component.html',
})
export class GlassSelectorComponent {
  @Output() tintChange = new EventEmitter<boolean>();
  tinted = false;

  toggleTint(): void {
    this.tinted = !this.tinted;
    this.tintChange.emit(this.tinted);
  }
}
