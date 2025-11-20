import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../pages/features/users/user.service';
import { AlertService } from '../../core/services/alert.service';
import { VehicleCustomizationService } from '../../pages/features/vehicle-3D/services/vehicle-customization.service';
import { UserCarViewerComponent } from '../../pages/features/vehicle-3D/user-car-viewer/user-car-viewer.component';
import { VehicleService } from '../../core/services/vehicle.service';
import { IVehiculo } from '../../core/interfaces';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, UserCarViewerComponent],
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('vehiclesAnchor') vehiclesAnchor?: ElementRef<HTMLDivElement>;

  private userService = inject(UserService);
  private customizationService = inject(VehicleCustomizationService);
  private alertService = inject(AlertService);
  private vehicleService = inject(VehicleService);
  private router = inject(Router);

  user: any = null;
  userCar: any = null;
  isLoading = true;

  badges = [
    { name: 'Classic Collector' },
    { name: 'Muscle Car Expert' },
    { name: 'Top Speed Designer' },
  ];

  userVehicles: IVehiculo[] = [];
  private intersectionObserver?: IntersectionObserver;
  private vehiclesPage = 1;
  private readonly vehiclesPageSize = 6;
  isVehiclesLoading = false;
  hasMoreVehicles = true;
  hasLoadedVehicles = false;

  ngOnInit(): void {
    this.loadProfile();
    this.loadUserCar();
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
  }

  loadProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (res: any) => {
        this.user = res.data;
        if (this.user?.visibility) {
          this.user.visibility = this.user.visibility.toLowerCase().trim();
        }
        this.isLoading = false;
        this.resetVehiclesFeed();
        this.loadMoreVehicles();
      },
      error: (err) => {
        console.error('Error al obtener perfil:', err);
        this.alertService.error('Error al cargar el perfil del usuario.');
        this.isLoading = false;
      },
    });
  }

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

  identifyCar(): void {
    this.router.navigate(['/app/ai-detection']);
  }

  private resetVehiclesFeed(): void {
    this.userVehicles = [];
    this.vehiclesPage = 1;
    this.hasMoreVehicles = true;
    this.hasLoadedVehicles = false;
  }

  trackByVehicle = (_: number, vehicle: IVehiculo) =>
    vehicle.id ?? `${vehicle.marca}-${vehicle.modelo}-${vehicle.anio}-${_}`;

  private loadMoreVehicles(): void {
    if (!this.user?.id || this.isVehiclesLoading || !this.hasMoreVehicles) {
      return;
    }

    this.isVehiclesLoading = true;

    this.vehicleService
      .getVehiclesByUser(this.user.id, this.vehiclesPage, this.vehiclesPageSize)
      .subscribe({
        next: (res) => {
          const vehicles = res.data ?? [];
          this.userVehicles = [...this.userVehicles, ...vehicles];

          const meta = res.meta;
          const currentPage =
            (meta?.pageNumber as number | undefined) ?? this.vehiclesPage;
          const totalPages = meta?.totalPages as number | undefined;

          if (totalPages !== undefined) {
            this.hasMoreVehicles = currentPage < totalPages;
          } else {
            this.hasMoreVehicles = vehicles.length === this.vehiclesPageSize;
          }

          this.vehiclesPage = currentPage + 1;
          this.hasLoadedVehicles = true;
          this.isVehiclesLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar vehículos:', err);
          this.alertService.error('No se pudieron cargar los vehículos.');
          this.hasLoadedVehicles = true;
          this.isVehiclesLoading = false;
        },
      });
  }

  private setupIntersectionObserver(): void {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return;
    }

    this.intersectionObserver?.disconnect();

    if (!this.vehiclesAnchor) {
      return;
    }

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.loadMoreVehicles();
        }
      });
    });

    this.intersectionObserver.observe(this.vehiclesAnchor.nativeElement);
  }
}
