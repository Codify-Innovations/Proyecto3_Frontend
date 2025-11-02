import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { baseUrlInterceptor } from './core/interceptors/base-url.interceptor';
import { accessTokenInterceptor } from './core/interceptors/access-token.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { OAuthModule } from 'angular-oauth2-oidc';
import { APP_INITIALIZER } from '@angular/core';
import { AuthService } from './services/auth.service';
import { handleErrorsInterceptor } from '././core/interceptors/handle-errors.interceptor';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from './core/utils/custom-translate-loader';

export function initializeAuth(authService: AuthService): () => Promise<void> {
  return () => authService.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(
      withInterceptors([baseUrlInterceptor, accessTokenInterceptor])
    ),
    provideAnimationsAsync(),
    importProvidersFrom(
      OAuthModule.forRoot(),
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useClass: CustomTranslateLoader,
        },
      })
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true,
    },
  ],
};
