import { Component, effect, inject } from '@angular/core';
import { DashboardRankingComponent } from '../../../components/dashboard/dashboard-ranking/dashboard-ranking.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardRankingComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
}
