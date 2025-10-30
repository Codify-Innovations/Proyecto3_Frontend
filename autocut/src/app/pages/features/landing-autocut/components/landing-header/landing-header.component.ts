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
  isMenuOpen: boolean = false;

  constructor(private router: Router) {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.isMenuOpen = false; // Cerrar menú al navegar
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}

