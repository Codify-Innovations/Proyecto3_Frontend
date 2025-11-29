import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AlertService } from '../../../core/services/alert.service';

import { Chart, registerables } from 'chart.js';
import { AdminMetricsService } from '../../../core/services/admin-metrics.service';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-admin-metrics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-admin-metrics.component.html',
})
export class DashboardAdminMetricsComponent implements OnInit {

  private adminMetricsService = inject(AdminMetricsService);
  private alertService = inject(AlertService);
  private cdr = inject(ChangeDetectorRef);

  // Signals
  metricas = this.adminMetricsService.metricas$;
  loading = this.adminMetricsService.loading$;

  startDate: string = '';
  endDate: string = '';

  // Charts
  donutChart: Chart | null = null;
  barChart: Chart | null = null;

  ngOnInit(): void {
    // No carga nada hasta que seleccione fechas
  }

  loadMetrics() {
    if (!this.startDate || !this.endDate) {
      this.alertService.error('Selecciona ambas fechas.');
      return;
    }

    if (this.endDate < this.startDate) {
      this.alertService.error('La fecha final no puede ser menor que la inicial.');
      return;
    }

    this.adminMetricsService.getAdminMetrics(this.startDate, this.endDate);

    // Esperar a que el signal actualice y renderizar
    setTimeout(() => {
      this.cdr.detectChanges();
      this.renderCharts();
    }, 100);
  }

  private renderCharts() {
    const m = this.metricas();

    if (!m) return;

    // ====================
    // DONUT CHART
    // ====================
    if (this.donutChart) this.donutChart.destroy();

    const donutCanvas = document.getElementById('donutChart') as HTMLCanvasElement;
    const ctx1 = donutCanvas.getContext('2d');

    if (ctx1) {
      const total = m.totalVideos + m.totalVehiculos + m.totalAnalisis + m.totalLogros + m.nuevosUsuarios;

      this.donutChart = new Chart(ctx1, {
        type: 'doughnut',
        data: {
          labels: [
            'Videos',
            'Vehículos',
            'Análisis IA',
            'Logros',
            'Nuevos Usuarios'
          ],
          datasets: [
            {
              data: [
                m.totalVideos,
                m.totalVehiculos,
                m.totalAnalisis,
                m.totalLogros,
                m.nuevosUsuarios
              ],
              backgroundColor: [
                '#4e79a7',
                '#d37295',
                '#59a14f',
                '#f28e2b',
                '#edc949'
              ],
              borderWidth: 2,
              hoverOffset: 8
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: 20
          },
          plugins: {
            legend: {
              position: 'right',
              align: 'center',
              labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                padding: 20,
                font: {
                  size: 14
                }
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.raw as number;
                  const percent = ((value / total) * 100).toFixed(1);
                  return `${context.label}: ${value} (${percent}%)`;
                }
              }
            }
          },
          cutout: '55%', // grosor del donut
        }
      });
    }


    // ====================
    // BAR CHART
    // ====================
    if (this.barChart) this.barChart.destroy();

    const barCanvas = document.getElementById('barChart') as HTMLCanvasElement;
    const ctx2 = barCanvas.getContext('2d');

    if (ctx2) {
      this.barChart = new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: [
            'Videos',
            'Vehículos',
            'Análisis IA',
            'Logros',
            'Nuevos Usuarios'
          ],
          datasets: [
            {
              label: 'Cantidad',
              data: [
                m.totalVideos,
                m.totalVehiculos,
                m.totalAnalisis,
                m.totalLogros,
                m.nuevosUsuarios
              ],
              backgroundColor: [
                '#4e79a7',
                '#d37295',
                '#59a14f',
                '#f28e2b',
                '#edc949'
              ],
              borderRadius: 6,
              hoverBackgroundColor: [
                '#3b5d82',
                '#b85c7c',
                '#47873e',
                '#ce741f',
                '#d4ae35'
              ]
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false  
            },
            tooltip: {
              callbacks: {
                label: ctx => `${ctx.label}: ${ctx.raw}`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 2 }
            }
          }
        }
      });
    }
  }
}
