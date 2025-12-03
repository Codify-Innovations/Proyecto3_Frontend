import { Component, inject, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../pages/features/auth/auth.service';
import { IRoleType } from '../../../core/interfaces';

@Component({
  selector: 'app-navbar-client',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-client.component.html',
  styleUrls: ['./navbar-client.component.scss']
})
export class NavbarClientComponent {
  @Input() AutoCutLogo: string = '';

  isMenuOpen: boolean = false;
  isProfileDropdownOpen: boolean = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  public menuItems: { label: string; route: string }[] = [];

  public isSuperAdmin: boolean = false;

  constructor() {
    this.buildMenu();
  }

  private buildMenu() {
    const user = this.authService.getUser();
    const authorities = user?.authorities?.map(a => a.authority) || [];


    this.isSuperAdmin = authorities.includes(IRoleType.superAdmin);

    if (this.isSuperAdmin) {

      this.menuItems = [
        { label: 'Dashboard', route: '/app/admin-dashboard' },
        { label: 'Gestión de usuarios', route: '/app/users' },
        { label: 'Reportes', route: '/app/admin-reports' },
      ];
    } else {

      this.menuItems = [
        { label: 'Dashboard', route: '/app/dashboard' },
        { label: 'Detector IA', route: '/app/ai-detection' },
        { label: 'Editor', route: '/app/video-editor' },
        { label: 'Generador IA', route: '/app/ia/generator' },
        { label: 'AI QA', route: '/app/analyze-media' },
        { label: 'Logros', route: '/app/achievements' },
        { label: 'Explorar Usuarios', route: '/app/public-users' },
      ];
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.profile-dropdown-container');
    if (!clickedInside) {
      this.isProfileDropdownOpen = false;
      this.cdr.detectChanges();
    }
  }

  toggleProfileDropdown(event: Event): void {
    event.stopPropagation();
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    this.cdr.detectChanges();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.isMenuOpen = false;
  }

  navigateToProfile(): void {
    this.router.navigate(['/app/profile']);
    this.isProfileDropdownOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}