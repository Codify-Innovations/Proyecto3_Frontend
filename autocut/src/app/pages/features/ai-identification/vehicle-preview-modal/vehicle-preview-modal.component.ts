import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle-preview-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle-preview-modal.component.html',
})
export class VehiclePreviewModalComponent {
  @Input() imageURL: string | null = null;

  @Input() isVisible = false;

  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
