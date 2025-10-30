import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-user-privacy',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-privacy.component.html',
})
export class UserPrivacyComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private alertService = inject(AlertService);

  form!: FormGroup;
  isLoading = false;

  ngOnInit(): void {
    this.form = this.fb.group({
      visibility: ['public'],
    });
    this.loadPrivacySetting();
  }

  /** Carga la configuración actual desde el backend */
  loadPrivacySetting(): void {
    this.isLoading = true;
    this.userService.getPrivacySetting().subscribe({
      next: (res: any) => {
        this.form.patchValue({ visibility: res.visibility });
        this.isLoading = false;
      },
      error: () => {
        this.alertService.error('Error al cargar configuración de privacidad.');
        this.isLoading = false;
      },
    });
  }

  /** Actualiza la configuración de privacidad en el backend */
  updatePrivacySetting(): void {
    const visibility = this.form.value.visibility;

    if (!['public', 'private'].includes(visibility)) {
      this.alertService.error('Valor inválido. Solo se permite público o privado.');
      return;
    }

    this.isLoading = true;

    this.userService.updatePrivacySetting(visibility).subscribe({
      next: () => {
        this.alertService.success('Configuración actualizada correctamente.');
        this.isLoading = false;
      },
      error: () => {
        this.alertService.error('Error al actualizar configuración.');
        this.isLoading = false;
      },
    });
  }
}

