import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../pages/features/users/user.service';
import { AlertService } from '../../core/services/alert.service';
import { VehicleCustomizationService } from '../../pages/features/vehicle-3D/services/vehicle-customization.service';
import { UserCarViewerComponent } from '../../pages/features/vehicle-3D/user-car-viewer/user-car-viewer.component';
import { AchievementService } from '../../core/services/achievement.service';
import { AchievementListComponent } from '../../components/achievements/achievements-list/achievement-list.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UserCarViewerComponent,
    AchievementListComponent,
  ],
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
  private userService = inject(UserService);
  private customizationService = inject(VehicleCustomizationService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private achievementService = inject(AchievementService);

  user: any = null;
  userCar: any = null;
  isLoading = true;
  
  // ===== SIGNAL DE LOGROS ===== //
  achievements = this.achievementService.achievements$();
  loading = this.achievementService.loading$();
  error = this.achievementService.error$();

  badges = [
    { name: 'Classic Collector' },
    { name: 'Muscle Car Expert' },
    { name: 'Top Speed Designer' },
  ];

  cars: any[] = [
    { model: 'Mustang GT', brand: 'Ford', year: 2024, image: '' },
    { model: 'Supra MK4', brand: 'Toyota', year: 1998, image: '' },
    { model: 'Camaro ZL1', brand: 'Chevrolet', year: 2022, image: '' },
  ];

  showModal = false;
  selectedImage: string | null = null;

  newCar: any = {
    model: '',
    brand: '',
    year: '',
    image: '',
  };

  ngOnInit(): void {
    this.loadProfile();
    this.loadUserCar();
  }

  loadProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (res: any) => {
        this.user = res.data;
        if (this.user?.visibility)
          this.user.visibility = this.user.visibility.toLowerCase().trim();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener perfil:', err);
        this.alertService.error('Error al cargar el perfil del usuario.');
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

  goToSettings(): void {
    this.router.navigate(['/app/profile/settings']);
  }

  openModal(): void {
    this.showModal = true;
  }
  identifyCar(): void {
    this.router.navigate(['/app/ai-detection']);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => (this.selectedImage = e.target.result);
      reader.readAsDataURL(file);
    }
  }
}
