import { TranslateLoader } from '@ngx-translate/core';
import { Observable, from } from 'rxjs';

/**
 * Custom loader para cargar archivos JSON desde /assets/i18n
 * usando fetch() — compatible con Angular Vite.
 */
export class CustomTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return from(
      fetch(`/assets/i18n/${lang}.json`).then((response) => {
        if (!response.ok) {
          throw new Error(`Error cargando traducciones: ${response.status}`);
        }
        return response.json();
      })
    );
  }
}
