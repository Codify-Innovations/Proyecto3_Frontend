import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit } from '@angular/core';
import { FormsModule, NgModel, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { environment } from '../../../../../environments/environment.development';

declare var gapi: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginError!: string;
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

  ngOnInit() {
    // Cargar el script de Google API si no está presente
    if (typeof gapi === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/platform.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        gapi.load('auth2', () => {
          gapi.auth2.init({
            client_id: environment.googleClientId,
          });
        });
      };
    } else {
      gapi.load('auth2', () => {
        gapi.auth2.init({
          client_id: environment.googleClientId, // Tu Client ID de Google
        });
      });
    }
  }

  public handleLogin(frm: NgForm) {
    if (frm.invalid) {
      if (!this.emailModel.valid) {
        this.emailModel.control.markAsTouched();
      }

      if (!this.passwordModel.valid) {
        this.passwordModel.control.markAsTouched();
      }

      return;
    }

    this.authService.login(this.loginForm).subscribe({
      next: () => this.router.navigateByUrl('/app/dashboard'),
      error: (err: any) => (this.loginError = err.error.description),
    });
  }

public handleGoogleLogin() {
  const auth2 = gapi.auth2.getAuthInstance();

  auth2.signIn().then((googleUser: any) => {
    const idToken = googleUser.getAuthResponse().id_token;
  })
  .catch((error: any) => {
    console.error('Google Sign-In Error:', error);
    this.loginError = 'Google Sign-In failed. Please try again.';
  });
}
}
