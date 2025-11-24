import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { UserCarViewerComponent } from '../../pages/features/vehicle-3D/user-car-viewer/user-car-viewer.component';

@Component({
  selector: 'app-public-profile',
  standalone: true,
  imports: [CommonModule, UserCarViewerComponent],
  templateUrl: './public-profile.component.html',
})
export class PublicProfileComponent implements OnInit {

  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  profile = signal<any | null>(null);

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username')!;

    this.userService.getPublicProfile(username).subscribe({
      next: (res: any) => {
        const { allowed, profile } = res.data;

        if (!allowed) {
          this.error.set("Este usuario tiene un perfil privado.");
          this.loading.set(false);
          return;
        }

    
        profile.username = profile.username ?? username;

        this.profile.set(profile);
        this.loading.set(false);
      },
      error: () => {
        this.error.set("Error al cargar el perfil público.");
        this.loading.set(false);
      }
    });
  }
}
