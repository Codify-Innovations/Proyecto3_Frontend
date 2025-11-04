import { Component, inject, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../pages/features/auth/auth.service';

@Component({
  selector: 'app-navbar-client',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-client.component.html',
  styleUrls: ['./navbar-client.component.scss']
})
export class NavbarClientComponent {
  @Input() AutoCutLogo: string = ''; //Receives the logo parameter
  isMenuOpen: boolean = false;
  isProfileDropdownOpen: boolean = false;
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.profile-dropdown-container');
    
    if (!clickedInside && this.isProfileDropdownOpen) {
      this.isProfileDropdownOpen = false;
      this.cdr.detectChanges();
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.cdr.detectChanges();
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

