import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
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
}
