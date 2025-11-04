import { CommonModule } from '@angular/common';
import { Component, ViewChild, AfterViewInit, inject } from '@angular/core';
import { FormsModule, NgModel, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../pages/features/auth/auth.service';
import { IUser } from '../../../../core/interfaces/index';
import { environment } from '../../../../../environments/environment.development';
import { AlertService } from '../../../../core/services/alert.service';

declare const google: any;

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignUpComponent implements AfterViewInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertService = inject(AlertService);
  public signUpError = '';
  public validSignup = false;

  @ViewChild('name') nameModel!: NgModel;
  @ViewChild('lastname') lastnameModel!: NgModel;
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;
  @ViewChild('confirmPassword') confirmPasswordModel!: NgModel;

  public user: IUser = {
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  // =====================================
  // =========== SIGNUP NORMAL ===========
  // =====================================
  public handleSignup(frm: NgForm): void {
    if (frm.invalid) {
      if (!this.nameModel.valid) this.nameModel.control.markAsTouched();
      if (!this.lastnameModel.valid) this.lastnameModel.control.markAsTouched();
      if (!this.emailModel.valid) this.emailModel.control.markAsTouched();
      if (!this.passwordModel.valid) this.passwordModel.control.markAsTouched();
      if (!this.confirmPasswordModel.valid) this.confirmPasswordModel.control.markAsTouched();
      return;
    }

    if (this.user.password !== this.user.confirmPassword) {
      this.alertService.error('Las contraseñas no coinciden.');
      return;
    }

    this.authService.signup(this.user).subscribe({
      next: (res: any) => {
        this.alertService.success(res.message || 'Registro completado correctamente.');
        this.validSignup = true;
        this.router.navigateByUrl('/app/dashboard');
      },
      error: (err: any) => {
        if (err.status === 409) {
              this.alertService.error('El correo electrónico ya está en uso.');
        } else {
          const msg = err.error?.message || 'Ocurrió un error durante el registro.';
          this.alertService.error(msg);
        }
      },
    });
  }

  // =====================================
  // =========== GOOGLE SIGNUP ===========
  // =====================================
  ngAfterViewInit(): void {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => this.handleGoogleResponse(response),
    });

    google.accounts.id.renderButton(
      document.getElementById('googleBtnSignup'),
      { theme: 'outline', size: 'large', width: 300 }
    );
  }

  private handleGoogleResponse(response: any): void {
    const idToken = response.credential;

    if (!idToken) {
      return;
    }

    this.authService.loginWithGoogle(idToken).subscribe({
      next: (res: any) => {
        this.router.navigateByUrl('/app/dashboard');
      },
      error: (err) => {
        const msg = err.error?.message || 'No se pudo completar el registro con Google.';
        this.alertService.error(msg);
      },
    });
  }
}
