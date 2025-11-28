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

  constructor() {
    this.buildMenu();
  }

  private buildMenu() {
    const user = this.authService.getUser();
    const authorities = user?.authorities?.map(a => a.authority) || [];
    const isSuperAdmin = authorities.includes(IRoleType.superAdmin);

    if (isSuperAdmin) {
      // MENU PARA SUPER ADMIN
      this.menuItems = [
        { label: 'Dashboard', route: '/app/dashboard' },
        { label: 'Gestión de usuarios', route: '/app/users' },
        { label: 'Reportes', route: '/app/reports' },
        { label: 'Settings', route: '/app/settings' },
      ];
    } else {
      // MENU PARA USUARIOS NORMALES
      this.menuItems = [
        { label: 'Dashboard', route: '/app/dashboard' },
        { label: 'AI Detection', route: '/app/ai-detection' },
        { label: 'Editor', route: '/app/video-editor' },
        { label: 'AI Generate', route: '/app/ia/generator' },
        { label: 'AI QA', route: '/app/analyze-media' },
        { label: 'Achievements', route: '/app/achievements' },
        { label: 'Public Users', route: '/app/public-users' },
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

