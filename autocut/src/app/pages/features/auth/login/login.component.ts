import { CommonModule } from '@angular/common';
import { Component, ViewChild, AfterViewInit, inject } from '@angular/core';
import { FormsModule, NgModel, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../pages/features/auth/auth.service';
import { environment } from '../../../../../environments/environment.development';
import { AlertService } from '../../../../core/services/alert.service';
import { finalize } from 'rxjs';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements AfterViewInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  public loginError = '';
  public loading = false;

  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;

  public loginForm = {
    email: '',
    password: '',
  };

  // =====================================================
  // LOGIN TRADICIONAL
  // =====================================================
  public handleLogin(frm: NgForm): void {
    if (frm.invalid || this.loading) {
      if (!this.emailModel.valid) this.emailModel.control.markAsTouched();
      if (!this.passwordModel.valid) this.passwordModel.control.markAsTouched();
      return;
    }

    this.loading = true; 

    this.authService
      .login(this.loginForm)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/app/dashboard');
        },
        error: (err: any) => {
          const msg = err.error?.message || 'Error al iniciar sesión.';
          this.alertService.error(msg);
        },
      });
  }

  // =====================================================
  // LOGIN CON GOOGLE
  // =====================================================
  private handleGoogleResponse(response: any): void {
    const idToken = response.credential;
    if (!idToken || this.loading) return;

    this.loading = true;

    this.authService
      .loginWithGoogle(idToken)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => this.router.navigateByUrl('/app/dashboard'),
        error: (err: any) => {
          const msg = err.error?.message || 'No se pudo iniciar sesión con Google.';
          this.alertService.error(msg);
        },
      });
  }

  // =====================================================
  // INICIALIZAR GOOGLE LOGIN
  // =====================================================
  ngAfterViewInit(): void {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => this.handleGoogleResponse(response),
    });

    google.accounts.id.renderButton(document.getElementById('googleBtn'), {
      theme: 'outline',
      size: 'large',
      width: 300,
    });
  }
}
