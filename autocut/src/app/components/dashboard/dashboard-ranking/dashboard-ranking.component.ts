import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IRankingUser, IResponse } from '../../../core/interfaces';
import { RankingService } from '../../../core/services/ranking.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from '../../../core/services/utils/logger.service';

@Component({
  selector: 'app-dashboard-ranking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-ranking.component.html',
})
export class DashboardRankingComponent implements OnInit {
  private rankingService = inject(RankingService);
  private logger = inject(LoggerService);
  topUsers: IRankingUser[] = [];
  isLoading = true;
  hasError = false;

  ngOnInit() {
    this.loadRanking();
  }
  userHeight(i: number) {
    const heights = [100, 140, 180, 120, 60];
    return heights[i];
  }


  loadRanking() {
    this.rankingService.getTopUsers().subscribe({
      next: (response: IResponse<IRankingUser[]>) => {
        this.topUsers = response.data ?? [];
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.logger.error(err.message);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }
}
