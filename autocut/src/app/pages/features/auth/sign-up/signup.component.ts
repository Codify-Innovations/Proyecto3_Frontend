import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { IUser } from '../../../../core/interfaces/index';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignUpComponent {
  public signUpError!: string;
  public validSignup!: boolean;
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

  constructor(private router: Router, 
              private authService: AuthService) {}

  public handleSignup(frm: NgForm): void {
    if (frm.invalid) {
      if (!this.nameModel.valid) {
        this.nameModel.control.markAsTouched();
      }
      if (!this.lastnameModel.valid) {
        this.lastnameModel.control.markAsTouched();
      }
      if (!this.emailModel.valid) {
        this.emailModel.control.markAsTouched();
      }
      if (!this.passwordModel.valid) {
        this.passwordModel.control.markAsTouched();
      }
      if (!this.confirmPasswordModel.valid || this.user.password !== this.user.confirmPassword) {
        this.confirmPasswordModel.control.markAsTouched();
      }
      return;
    }

    if (this.user.password !== this.user.confirmPassword) {
      this.signUpError = "Passwords do not match!";
      return;
    }

    this.authService.signup(this.user).subscribe({
      next: () => {
        this.validSignup = true;
        this.router.navigateByUrl('/login');
      },
      error: (err: any) => {
        this.signUpError = err.description || 'An error occurred during registration.';
      },
    });
  }
}
