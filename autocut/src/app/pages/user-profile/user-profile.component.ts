import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../pages/features/users/user.service';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
  private userService = inject(UserService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  user: any = null;
  isLoading = true;

  // Badges temporales
  badges = [
    { name: 'Classic Collector' },
    { name: 'Muscle Car Expert' },
    { name: 'Top Speed Designer' },
  ];

  // Modelos temporales
  cars: any[] = [
    { model: 'Mustang GT', brand: 'Ford', year: 2024, image: '' },
    { model: 'Supra MK4', brand: 'Toyota', year: 1998, image: '' },
    { model: 'Camaro ZL1', brand: 'Chevrolet', year: 2022, image: '' },
  ];

  // Modal base
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

  goToSettings(): void {
    this.router.navigate(['/app/profile/settings']);
  }



  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedImage = null;
    this.newCar = { model: '', brand: '', year: '', image: '' };
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => (this.selectedImage = e.target.result);
      reader.readAsDataURL(file);
    }
  }

  addCar(): void {
    
    this.cars.push({
      model: this.newCar.model,
      brand: this.newCar.brand,
      year: this.newCar.year,
      image: this.selectedImage || '',
    });
    this.closeModal();
  }
}
