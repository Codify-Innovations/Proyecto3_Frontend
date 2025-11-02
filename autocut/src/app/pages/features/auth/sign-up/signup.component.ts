import { CommonModule } from '@angular/common';
import { Component, ViewChild, AfterViewInit  } from '@angular/core';
import { FormsModule, NgModel, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { IUser } from '../../../../core/interfaces/index';
import { environment } from '../../../../../environments/environment.development';

declare const google: any;


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignUpComponent implements AfterViewInit {
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

  constructor(private router: Router, private authService: AuthService) {}

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
      this.signUpError = 'Passwords do not match!';
      return;
    }

    this.authService.signup(this.user).subscribe({
      next: () => {
        this.validSignup = true;
        this.router.navigateByUrl('/app/dashboard'); // 🔥 Auto-login tras signup
      },
      error: (err: any) => {
        this.signUpError = err.description || 'An error occurred during registration.';
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
      this.signUpError = 'No se obtuvo el ID Token de Google.';
      return;
    }

    this.authService.loginWithGoogle(idToken).subscribe({
      next: () => this.router.navigateByUrl('/app/dashboard'),
      error: (err) => {
        console.error('Error al registrarse con Google:', err);
        this.signUpError = 'No se pudo completar el registro con Google.';
      },
    });
  }
}