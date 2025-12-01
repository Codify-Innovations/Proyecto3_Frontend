import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AlertService } from './alert.service';
import { IAdminMetricas, IResponse } from '../interfaces';

@Injectable({
    providedIn: 'root',
})
export class AdminMetricsService {
    private http = inject(HttpClient);
    private alertService = inject(AlertService);

    private readonly source = 'api/metricas/admin';

    private metricas = signal<IAdminMetricas | null>(null);
    get metricas$() {
        return this.metricas;
    }

    private loading = signal<boolean>(false);
    get loading$() {
        return this.loading;
    }

    getAdminMetrics(start: string, end: string) {
        this.loading.set(true);

        const params = new HttpParams()
            .set('start', start)
            .set('end', end);

        this.http
            .get<IResponse<IAdminMetricas>>(this.source, { params })
            .subscribe({
                next: (response) => {
                    this.loading.set(false);

                    if (response?.data) {
                        this.metricas.set(response.data);
                    } else {
                        this.alertService.displayAlert(
                            'error',
                            'No se recibió información válida del servidor.',
                            'center',
                            'top',
                            ['error-snackbar']
                        );
                    }
                },
                error: (err) => {
                    this.loading.set(false);
                    const backendMessage =
                        err?.error?.message || 'Error al obtener métricas globales.';
                    this.alertService.displayAlert(
                        'error',
                        backendMessage,
                        'center',
                        'top',
                        ['error-snackbar']
                    );
                    console.error('❌ Error en AdminMetricasService:', err);
                },
            });
    }

    getAdminMetricsGlobal() {
        this.loading.set(true);

        this.http
            .get<IResponse<IAdminMetricas>>(`${this.source}/global`)
            .subscribe({
                next: (response) => {
                    this.loading.set(false);

                    if (response?.data) {
                        this.metricas.set(response.data);
                    } else {
                        this.alertService.displayAlert(
                            'error',
                            'No se recibió información válida del servidor.',
                            'center',
                            'top',
                            ['error-snackbar']
                        );
                    }
                },
                error: (err) => {
                    this.loading.set(false);
                    const backendMessage =
                        err?.error?.message || 'Error al obtener métricas globales.';
                    this.alertService.displayAlert(
                        'error',
                        backendMessage,
                        'center',
                        'top',
                        ['error-snackbar']
                    );
                    console.error('❌ Error en AdminMetricasService (GLOBAL):', err);
                },
            });
    }

}   
