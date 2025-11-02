import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-settings.component.html',
})
export class UserSettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  form!: FormGroup;
  isLoading = false;
  avatarUrl = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; 

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      bio: ['', [Validators.maxLength(200)]],
      password: [
        '',
        [Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)],
      ],
      visibility: ['public'],
    });

    this.loadUserData();
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

 
  updateUserSettings(): void {
    if (this.form.invalid) {
      this.alertService.error('Por favor, completa los campos correctamente.');
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const { name, lastname, email, bio, password, visibility } = this.form.value;

    const updatePayload: any = {
      name,
      lastname,
      email,
      bio,
      visibility,
    };

    if (password && password.trim() !== '') {
      updatePayload.password = password;
    }

    console.log('🟢 Payload enviado:', updatePayload); 

    this.userService.updateUserProfile(updatePayload).subscribe({
      next: (res: any) => {
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


  editAvatar(): void {
    this.router.navigate(['/app/profile/avatar']);
  }
}

