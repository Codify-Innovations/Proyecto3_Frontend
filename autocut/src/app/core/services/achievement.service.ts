import { effect, Injectable, signal } from '@angular/core';
import { IResponse, IUsuarioLogro } from '../interfaces';
import { BaseService } from './base-service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../pages/features/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AchievementService extends BaseService<IUsuarioLogro> {
  protected override source: string = `api/logros`;

  // --- Signals ---
  private achievements = signal<IUsuarioLogro[]>([]);
  get achievements$() {
    return this.achievements;
  }

  private loading = signal<boolean>(false);
  get loading$() {
    return this.loading;
  }

  private error = signal<string | null>(null);
  get error$() {
    return this.error;
  }
  constructor(private auth: AuthService) {
    super();

    effect(() => {
      const user = this.auth.currentUser();

      if (user) {
        this.clearAchievements();
        this.loadMyAchievements();
      } else {
        this.clearAchievements();
      }
    });
  }

  // ============================
  //   CARGAR LOGROS (AUTENTICADO)
  // ============================
  loadMyAchievements(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http
      .get<IResponse<IUsuarioLogro[]>>(`${this.source}/mis-logros`)
      .subscribe({
        next: (res) => {
          this.achievements.set(res.data ?? []);
          console.log(res);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se pudieron cargar los logros.');
          this.loading.set(false);
        },
      });
  }

  // ============================
  //   CARGAR LOGROS PÚBLICOS
  // ============================
  loadUserAchievements(usuarioId: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.http
      .get<IResponse<IUsuarioLogro[]>>(`${this.source}/usuario/${usuarioId}`)
      .subscribe({
        next: (res) => {
          this.achievements.set(res.data ?? []);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se pudieron cargar los logros públicos.');
          this.loading.set(false);
        },
      });
  }

  clearAchievements() {
    this.achievements.set([]);
    this.error.set(null);
    this.loading.set(false);
  }
}
