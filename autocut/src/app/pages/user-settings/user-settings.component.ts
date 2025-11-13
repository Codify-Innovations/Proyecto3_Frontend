import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../pages/features/users/user.service';
import { AlertService } from '../../core/services/alert.service';
import { Router } from '@angular/router';
import { VehicleCustomizationService } from '../../pages/features/vehicle-3D/services/vehicle-customization.service';
import { UserCarViewerComponent } from '../../pages/features/vehicle-3D/user-car-viewer/user-car-viewer.component';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UserCarViewerComponent],
  templateUrl: './user-settings.component.html',
})
export class UserSettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private customizationService = inject(VehicleCustomizationService);

  form!: FormGroup;
  isLoading = false;
  avatarUrl = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  private originalPasswordPlaceholder = '********';

  /** Configuración del carro del usuario */
  userCar: any = null;

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      bio: ['', [Validators.maxLength(200)]],
      password: [''],
      visibility: ['public'],
    });

    this.loadUserData();
    this.loadUserCar();
  }

  loadUserData(): void {
    this.isLoading = true;
    this.userService.getUserProfile().subscribe({
      next: (res: any) => {
        const user = res.data;
        this.form.patchValue({
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          bio: user.bio || '',
          visibility: user.visibility?.toLowerCase().trim() || 'public',
          password: this.originalPasswordPlaceholder,
        });
        this.avatarUrl = user.avatarUrl || this.avatarUrl;
        this.isLoading = false;
      },
      error: () => {
        this.alertService.error('Error al cargar los datos del usuario.');
        this.isLoading = false;
      },
    });
  }

  /** Cargar el carro personalizado del usuario */
  loadUserCar(): void {
    this.customizationService.getMyCustomization$().subscribe({
      next: (res: any) => {
        this.userCar = res.data || null;
        console.log('Carro del usuario:', this.userCar);
      },
      error: (err) => {
        console.warn('No se pudo cargar el carro del usuario:', err);
      },
    });
  }

  updateUserSettings(): void {
    if (this.form.invalid && !this.isOnlyPasswordInvalid()) {
      this.alertService.error('Por favor, completa los campos correctamente.');
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const { name, lastname, email, bio, password, visibility } = this.form.value;

    const updatePayload: any = { name, lastname, email, bio, visibility };

    if (password && password.trim() !== '' && password !== this.originalPasswordPlaceholder) {
      const isValid = /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
      if (!isValid) {
        this.alertService.error(
          'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.'
        );
        this.isLoading = false;
        return;
      }
      updatePayload.password = password;
    }


    this.userService.updateUserProfile(updatePayload).subscribe({
      next: () => {
        this.alertService.success('Datos actualizados correctamente.');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        const duplicate = err?.error?.message?.includes('Duplicate entry');
        const msg = duplicate
          ? 'El correo ya está en uso por otro usuario.'
          : 'Error al actualizar los datos.';
        this.alertService.error(msg);
        this.isLoading = false;
      },
    });
  }

  private isOnlyPasswordInvalid(): boolean {
    const passwordControl = this.form.get('password');
    return !!passwordControl && !!passwordControl.invalid && !passwordControl.value;
  }

  editAvatar(): void {
    this.router.navigate(['/app/vehicle-3d']);
  }
}
