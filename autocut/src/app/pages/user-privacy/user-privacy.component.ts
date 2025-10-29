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
  message: string | null = null;
  success = false;

  ngOnInit(): void {
    this.form = this.fb.group({
      visibility: ['public'],
    });

    this.loadPrivacySetting();
  }

  loadPrivacySetting(): void {
    this.isLoading = true;
    this.userService.getPrivacySetting().subscribe({
      next: (res: any) => {
        this.form.patchValue({ visibility: res.visibility });
        this.isLoading = false;
      },
      error: () => {
        this.message = 'Error al cargar configuración de privacidad.';
        this.success = false;
        this.isLoading = false;
      },
    });
  }

  updatePrivacySetting(): void {
    const visibility = this.form.value.visibility;

    if (!['public', 'private'].includes(visibility)) {
      this.message = 'Valor inválido. Solo se permite público o privado.';
      this.success = false;
      return;
    }

    this.isLoading = true;

    this.userService.updatePrivacySetting(visibility).subscribe({
      next: () => {
        this.message = 'Configuración actualizada correctamente.';
        this.success = true;
        this.isLoading = false;
      },
      error: () => {
        this.message = 'Error al actualizar configuración.';
        this.success = false;
        this.isLoading = false;
      },
    });
  }
}
