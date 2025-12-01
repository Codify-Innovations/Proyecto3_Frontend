import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { AlertService } from './alert.service';
import { AuthService } from '../../pages/features/auth/auth.service';
import { IAnalyzedContent, IAnalyzedContentPayload } from '../interfaces';

@Injectable({
    providedIn: 'root',
})
export class AnalyzedContentService extends BaseService<IAnalyzedContent> {
    protected override source: string = 'api/ia/analysis';

    private alertService = inject(AlertService);
    private authService = inject(AuthService);

    isSaving = signal<boolean>(false);
    get isSaving$() {
        return this.isSaving;
    }

    private savedAnalysis = signal<IAnalyzedContent | null>(null);
    get savedAnalysis$() {
        return this.savedAnalysis;
    }
    

    saveAnalysis(payload: IAnalyzedContentPayload): void {
        const user = this.authService.getUser();

        if (!user || !user.id) {
            this.alertService.displayAlert(
                'error',
                'No se encontró información del usuario autenticado.',
                'center',
                'top'
            );
            return;
        }

        const body: IAnalyzedContent = {
            userId: user.id,
            sourceUrl: payload.sourceUrl,
            analysisType: payload.analysisType,
            score: payload.score
        };

        this.isSaving.set(true);

        this.addCustomSource(`${user.id}`, body).subscribe({
            next: (response) => {
                this.isSaving.set(false);

                if (response && response.data) {
                    this.savedAnalysis.set(response.data);
                } else {
                    this.alertService.displayAlert(
                        'error',
                        'No se recibió una respuesta válida del servidor.',
                        'center',
                        'top'
                    );
                }
            },

            error: (err) => {
                this.isSaving.set(false);
                this.savedAnalysis.set(null);

                const backendMessage =
                    err?.error?.message || 'Error al registrar el análisis.';

                this.alertService.displayAlert(
                    'error',
                    backendMessage,
                    'center',
                    'top'
                );
            },
        });
    }
}
