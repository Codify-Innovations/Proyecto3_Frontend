import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-footer.component.html',
})
export class LandingFooterComponent {
  currentYear: number = new Date().getFullYear();
}

