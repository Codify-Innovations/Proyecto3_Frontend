import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsService } from '../../core/services/reports.service';
import { AlertService } from '../../core/services/alert.service';
import { IReporteRequest } from '../../core/interfaces';
import { AuthService } from '../../pages/features/auth/auth.service';

@Component({
    selector: 'app-report-exporter',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './report-exporter.component.html',
})
export class ReportExporterComponent {

    private reportesService = inject(ReportsService);
    private alertService = inject(AlertService);
    private authService = inject(AuthService);

    @Input() mode: 'range' | 'global' = 'global';
    @Input() startDate: string | null = null;
    @Input() endDate: string | null = null;

    loading = false;

    private adminUserId: number = 0

    ngOnInit(): void {
        this.adminUserId = this.getUserId();

        if (!this.adminUserId) {
            this.alertService.error("No se pudo identificar al usuario autenticado.");
        }
    }

    export(format: 'PDF' | 'CSV') {

        if (!this.adminUserId) {
            this.alertService.error('Usuario no autenticado. No se puede generar reportes.');
            return;
        }

        if (this.mode === 'range' && (!this.startDate || !this.endDate)) {
            this.alertService.error('Debes seleccionar un rango de fechas para exportar.');
            return;
        }

        const request: IReporteRequest = {
            global: this.mode === 'global',
            startDate: this.mode === 'range' ? this.startDate : null,
            endDate: this.mode === 'range' ? this.endDate : null,
            format,
            adminUserId: this.adminUserId
        };

        this.loading = true;

        this.reportesService.generarReporte(request, this.adminUserId).subscribe({
            next: (archivo) => {
                this.loading = false;
                this.descargarArchivo(archivo, format);
            },
            error: (err) => {
                this.loading = false;
                const msg = err?.error?.message || 'Error al generar reporte.';
                this.alertService.error(msg);
            },
        });
    }

    private descargarArchivo(blob: Blob, format: string) {
        const nombre = `reporte-${Date.now()}.${format.toLowerCase()}`;
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = nombre;
        a.click();

        URL.revokeObjectURL(url);
    }

    private getUserId(): number {
        const user = this.authService.getUser();
        return user?.id ?? 0;
    }

}
