import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../pages/features/users/user.service';
import { AlertService } from '../../core/services/alert.service';
import { VehicleCustomizationService } from '../../pages/features/vehicle-3D/services/vehicle-customization.service';
import { UserCarViewerComponent } from '../../pages/features/vehicle-3D/user-car-viewer/user-car-viewer.component';
import { VehicleService } from '../../core/services/vehicle.service';
import { IVehiculo } from '../../core/interfaces';
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
export class UserProfileComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() isVisitor = false;
  @Input() username?: string;

  @ViewChild('vehiclesAnchor') vehiclesAnchor?: ElementRef<HTMLDivElement>;

  private userService = inject(UserService);
  private customizationService = inject(VehicleCustomizationService);
  private alertService = inject(AlertService);
  private vehicleService = inject(VehicleService);
  private router = inject(Router);
  private achievementService = inject(AchievementService);

  user: any = null;
  userCar: any = null;

  isLoading = true;

  achievements = this.achievementService.achievements$;
  loading = this.achievementService.loading$;
  error = this.achievementService.error$;

  visitedAchievements: any[] = [];

  isPrivateProfile = false;

  userVehicles: IVehiculo[] = [];
  private intersectionObserver?: IntersectionObserver;
  private vehiclesPage = 1;
  private readonly vehiclesPageSize = 6;
  isVehiclesLoading = false;
  hasMoreVehicles = true;
  hasLoadedVehicles = false;

  ngOnInit(): void {
    if (this.isVisitor) {
      this.loadPublicProfile();
    } else {
      this.loadProfile();
      this.loadUserCar();
    }
  }

  ngAfterViewInit(): void {}

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

        setTimeout(() => this.setupIntersectionObserver(), 0);
      },
      error: () => {
        this.alertService.error('Error al cargar tu perfil.');
        this.isLoading = false;
      },
    });
  }

  loadUserCar(): void {
    this.customizationService.getMyCustomization$().subscribe({
      next: (res: any) => {
        this.userCar = res.data || null;
      },
      error: () => {}
    });
  }

  loadPublicProfile(): void {
    this.userService.getPublicProfile(this.username!).subscribe({
      next: (res: any) => {
        const { profile, allowed } = res.data;

        if (!allowed) {
          this.isPrivateProfile = true;
          this.isLoading = false;
          return;
        }

        this.user = profile;
        this.userCar = profile.customization ?? null;

        this.visitedAchievements = profile.logros ?? [];

        this.isLoading = false;

        this.resetVehiclesFeed();
        this.loadMoreVehiclesPublic(profile.id);

        setTimeout(() => this.setupIntersectionObserver(), 0);
      },
      error: () => {
        this.alertService.error('Error al cargar perfil público.');
        this.isLoading = false;
      },
    });
  }

  private loadMoreVehicles(): void {
    if (!this.user?.id || this.isVehiclesLoading || !this.hasMoreVehicles) return;

    this.isVehiclesLoading = true;

    this.vehicleService
      .getVehiclesByUser(this.user.id, this.vehiclesPage, this.vehiclesPageSize)
      .subscribe({
        next: (res) => {
          const vehicles = res.data ?? [];
          this.userVehicles = [...this.userVehicles, ...vehicles];

          this.hasMoreVehicles = vehicles.length === this.vehiclesPageSize;
          this.vehiclesPage++;
          this.hasLoadedVehicles = true;
          this.isVehiclesLoading = false;
        },
        error: () => {
          this.alertService.error('No se pudieron cargar los vehículos.');
          this.isVehiclesLoading = false;
          this.hasLoadedVehicles = true;
        },
      });
  }

  private loadMoreVehiclesPublic(id: number): void {
    if (this.isVehiclesLoading || !this.hasMoreVehicles) return;

    this.isVehiclesLoading = true;

    this.vehicleService
      .getVehiclesByUser(id, this.vehiclesPage, this.vehiclesPageSize)
      .subscribe({
        next: (res) => {
          const vehicles = res.data ?? [];
          this.userVehicles = [...this.userVehicles, ...vehicles];

          this.hasMoreVehicles = vehicles.length === this.vehiclesPageSize;
          this.vehiclesPage++;
          this.hasLoadedVehicles = true;
          this.isVehiclesLoading = false;
        },
        error: () => {
          this.alertService.error('No se pudieron cargar los vehículos públicos.');
          this.isVehiclesLoading = false;
          this.hasLoadedVehicles = true;
        },
      });
  }

  goToSettings(): void {
    if (!this.isVisitor) {
      this.router.navigate(['/app/profile/settings']);
    }
  }

  identifyCar(): void {
    if (!this.isVisitor) {
      this.router.navigate(['/app/ai-detection']);
    }
  }

  private resetVehiclesFeed(): void {
    this.userVehicles = [];
    this.vehiclesPage = 1;
    this.hasMoreVehicles = true;
    this.hasLoadedVehicles = false;
  }

  private setupIntersectionObserver(): void {
    if (!this.vehiclesAnchor || !this.user?.id || this.isPrivateProfile) return;

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (this.isVisitor) {
            this.loadMoreVehiclesPublic(this.user.id);
          } else {
            this.loadMoreVehicles();
          }
        }
      });
    });

    this.intersectionObserver.observe(this.vehiclesAnchor.nativeElement);
  }
}
