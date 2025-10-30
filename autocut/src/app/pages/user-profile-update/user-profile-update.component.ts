import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-user-profile-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile-update.component.html',
})
export class UserProfileUpdateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private alertService = inject(AlertService);

  form!: FormGroup;
  isLoading = false;
  message: string | null = null;
  success = false;

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      bio: ['', [Validators.maxLength(200)]],
      password: [
        '',
        [
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/), // al menos una mayúscula y un número
        ],
      ],
    });

    this.loadUserData();
  }

  loadUserData(): void {
    this.isLoading = true;
    this.userService.getUserProfile().subscribe({
      next: (user: any) => {
        this.form.patchValue({
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          bio: user.bio,
        });
        this.isLoading = false;
      },
      error: () => {
        this.alertService.error('Error al cargar los datos del usuario.');
        this.isLoading = false;
      },
    });
  }

  updateUserProfile(): void {
    if (this.form.invalid) {
      this.alertService.error('Por favor, completa los campos correctamente.');
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.userService.updateUserProfile(this.form.value).subscribe({
      next: () => {
        this.message = 'Datos actualizados correctamente.';
        this.success = true;
        this.isLoading = false;
        this.alertService.success(this.message);
      },
      error: (err) => {
        console.error('Error:', err);
        const duplicate = err?.error?.message?.includes('Duplicate entry');
        this.message = duplicate
          ? 'El correo ya está en uso por otro usuario.'
          : 'Error al actualizar los datos.';
        this.success = false;
        this.alertService.error(this.message);
        this.isLoading = false;
      },
    });
  }
}
