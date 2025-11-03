import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonial-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonial-card.component.html',
})
export class TestimonialCardComponent {
  @Input() authorName: string = '';
  @Input() authorLogo: string = '';
  @Input() testimonial: string = '';
}

