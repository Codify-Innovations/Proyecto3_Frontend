import { Component, OnInit, signal } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { UserCarViewerComponent } from '../../pages/features/vehicle-3D/user-car-viewer/user-car-viewer.component';

@Component({
  selector: 'app-public-users',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, UserCarViewerComponent],
  templateUrl: './public-users.component.html',
})
export class PublicUsersComponent implements OnInit {

  users = signal<any[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.userService.getPublicUsers().subscribe({
      next: (res: any) => {
        const list = res.data || [];

        const mapped = list
          .filter((u: any) => !u.username.toLowerCase().includes('admin'))
          .map((u: any) => ({
            ...u,
            publicName: u.username
          }));

        this.users.set(mapped);
        this.loading.set(false);
      },

      error: () => {
        this.error.set('No se pudieron cargar los usuarios. Inténtalo más tarde.');
        this.loading.set(false);
      },
    });
  }

  goToProfile(username: string): void {
    this.router.navigate(['/app/profile', username]);
  }
}
