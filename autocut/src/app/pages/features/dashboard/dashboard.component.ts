import { Component, effect, inject } from '@angular/core';
import { DashboardRankingComponent } from '../../../components/dashboard/dashboard-ranking/dashboard-ranking.component';
import { DashboardMetricsComponent } from '../../../components/dashboard/dashboard-metrics/dashboard-metrics.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardRankingComponent, DashboardMetricsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
}
