import { CommonModule } from '@angular/common';
import { Component, ViewChild, AfterViewInit, inject } from '@angular/core';
import { FormsModule, NgModel, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../pages/features/auth/auth.service';
import { environment } from '../../../../../environments/environment.development';
import { AlertService } from '../../../../core/services/alert.service';
import { finalize } from 'rxjs';
import { IRoleType } from '../../../../core/interfaces';

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

  public loading = false;

  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;

  public loginForm = {
    email: '',
    password: '',
  };

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
        next: () => this.redirectByRole(),
        error: (err: any) => {
          const rawMessage =
            err.error?.message ||
            err.error ||
            '';

          let finalMsg = 'Error al iniciar sesión.';

          // Detectar mensajes del backend
          if (rawMessage.toLowerCase().includes('inactiva')) {
            finalMsg = 'Tu cuenta está inactiva. Contacta al administrador.';
          } else if (rawMessage.toLowerCase().includes('credenciales')) {
            finalMsg = 'Credenciales inválidas. Verifica tus datos.';
          }

          this.alertService.error(finalMsg);
        },
      });
  }

  private handleGoogleResponse(response: any): void {
    const idToken = response.credential;
    if (!idToken || this.loading) return;

    this.loading = true;

    this.authService
      .loginWithGoogle(idToken)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => this.redirectByRole(),
        error: () => {
          this.alertService.error(
            'No fue posible iniciar sesión con Google.'
          );
        },
      });
  }

  private redirectByRole(): void {
    const user = this.authService.getUser();
    const authorities = user?.authorities?.map(a => a.authority) || [];

    if (authorities.includes(IRoleType.superAdmin)) {
      this.router.navigateByUrl('/app/users');
      return;
    }

    this.router.navigateByUrl('/app/dashboard');
  }

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
