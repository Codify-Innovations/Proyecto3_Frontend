import { CommonModule } from '@angular/common';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule, NgModel, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../pages/features/auth/auth.service';
import { environment } from '../../../../../environments/environment.development';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {
  public loginError = '';
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;

  public loginForm: { email: string; password: string } = {
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  // Login tradicional
  public handleLogin(frm: NgForm) {
    if (frm.invalid) {
      if (!this.emailModel.valid) this.emailModel.control.markAsTouched();
      if (!this.passwordModel.valid) this.passwordModel.control.markAsTouched();
      return;
    }

    this.authService.login(this.loginForm).subscribe({
      next: () => this.router.navigateByUrl('/app/dashboard'),
      error: (err: any) => (this.loginError = err.error.description || 'Error al iniciar sesión'),
    });
  }

  ngAfterViewInit(): void {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => this.handleGoogleResponse(response),
    });

    google.accounts.id.renderButton(
      document.getElementById('googleBtn'),
      { theme: 'outline', size: 'large', width: 300 }
    );
  }

  private handleGoogleResponse(response: any): void {
    const idToken = response.credential;

    if (!idToken) {
      this.loginError = 'No se obtuvo el ID Token de Google.';
      return;
    }

    this.authService.loginWithGoogle(idToken).subscribe({
      next: () => this.router.navigateByUrl('/app/dashboard'),
      error: (err) => {
        console.error('Error al iniciar sesión con Google:', err);
        this.loginError = 'No se pudo iniciar sesión con Google.';
      },
    });
  }
}
