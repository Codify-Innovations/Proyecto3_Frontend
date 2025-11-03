import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

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

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
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

