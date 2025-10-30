import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing-header.component.html',
})
export class LandingHeaderComponent {
  @Input() AutoCutLogo: string = '';

  constructor(private router: Router) {}

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}

