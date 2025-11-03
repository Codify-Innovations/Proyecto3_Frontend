import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './landing-header.component.html',
})
export class LandingHeaderComponent {
  @Input() AutoCutLogo: string = '';
  isMenuOpen: boolean = false;

  constructor(private router: Router, public translate: TranslateService) {}

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

  switchLang(lang: string): void {
    this.translate.use(lang);
  }
}
