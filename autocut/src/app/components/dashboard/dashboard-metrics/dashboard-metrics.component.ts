import { Component, inject, OnInit } from '@angular/core';
import { MetricsService } from '../../../core/services/metrics.service';
import { AlertService } from '../../../core/services/alert.service';
import { AuthService } from '../../../pages/features/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IDateMetrics, IUserSummary } from '../../../core/interfaces';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-dashboard-metrics',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-metrics.component.html',
})
export class DashboardMetricsComponent implements OnInit {

  private metricsService = inject(MetricsService);
  private alertService = inject(AlertService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  loading = false;

  summary: IUserSummary | null = null;

  startDate: string = '';
  endDate: string = '';

  dateMetrics: IDateMetrics | null = null;

  private metricsChart: Chart | null = null;

  noDateMetrics: boolean = false;

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary() {
    const userId = this.getUserId();
    if (!userId) return this.alertService.error('No se pudo obtener el usuario.');


    this.loading = true;
    this.metricsService.getSummary(userId).subscribe({
      next: (res) => {
        this.summary = res.data;
        this.loading = false;
      },
      error: () => {
        this.alertService.error('Error cargando las métricas del usuario.');
        this.loading = false;
      },
    });
  }

  loadDateMetrics() {
    const userId = this.getUserId();
    if (!userId) return this.alertService.error('No se pudo obtener el usuario.');


    if (!this.startDate || !this.endDate) {
      this.alertService.error('Selecciona ambas fechas.');
      return;
    }

    if (this.endDate < this.startDate) {
      this.alertService.error('La fecha final no puede ser menor que la inicial.');
      return;
    }

    this.loading = true;
    this.metricsService.getMetricsByDateRange(userId, this.startDate, this.endDate).subscribe({
      next: (res) => {
        const data = res.data;
        this.loading = false;

        const isEmpty =
          Object.keys(data?.videos || {}).length === 0 &&
          Object.keys(data?.logros || {}).length === 0 &&
          Object.keys(data?.analisis || {}).length === 0 &&
          Object.keys(data?.vehiculos || {}).length === 0;

        this.noDateMetrics = isEmpty;

        if (isEmpty) {
          this.dateMetrics = null;
          this.alertService.error('No hay métricas disponibles en el rango seleccionado.');
          return;
        }

        this.dateMetrics = data;
        this.cdr.detectChanges();
        this.renderChart();

        this.alertService.success('Panel actualizado correctamente.');
      },
      error: () => {
        this.alertService.error('Error cargando métricas por fecha.');
        this.loading = false;
      },
    });
  }

  private getUserId(): number | null {
    const user = this.authService.getUser();
    return user?.id ?? null;
  }


  private renderChart() {
    if (!this.dateMetrics) return;

    const labels = this.extractLabels();
    const labelsFormatted = labels.map(d => this.formatDate(d));
    const datasets = this.extractDatasets(labels);

    if (this.metricsChart) {
      this.metricsChart.destroy();
    }

    const canvas = document.getElementById('metricsChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.metricsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labelsFormatted,
        datasets,
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        scales: {
          x: {
            stacked: false
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      },
    });
  }

  private extractLabels(): string[] {
    const sets = this.dateMetrics!;

    const fechas = new Set<string>([
      ...Object.keys(sets.videos || {}),
      ...Object.keys(sets.logros || {}),
      ...Object.keys(sets.analisis || {}),
      ...Object.keys(sets.vehiculos || {}),
    ]);

    return Array.from(fechas).sort();
  }

  private extractDatasets(labels: string[]) {
    const sets = this.dateMetrics!;

    return [
      {
        label: 'Videos generados',
        data: labels.map(d => sets.videos[d] || 0),
        backgroundColor: '#4e79a7',
      },
      {
        label: 'Logros desbloqueados',
        data: labels.map(d => sets.logros[d] || 0),
        backgroundColor: '#f28e2b',
      },
      {
        label: 'Análisis realizados',
        data: labels.map(d => sets.analisis[d] || 0),
        backgroundColor: '#59a14f',
      },
      {
        label: 'Vehículos detectados',
        data: labels.map(d => sets.vehiculos[d] || 0),
        backgroundColor: '#d37295',
      },
    ];
  }

  private formatDate(dateStr: string): string {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }
}