import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IReporteRequest } from '../interfaces';

@Injectable({
    providedIn: 'root',
})
export class ReportsService {

    private http = inject(HttpClient);
    private readonly source = 'api/reportes';

    generarReporte(request: IReporteRequest, usuarioId: number) {
        return this.http.post(
            `${this.source}/generate/${usuarioId}`,
            request,
            { responseType: 'blob' }
        );
    }
}
