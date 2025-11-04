import { mergeApplicationConfig, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { OAuthModule } from 'angular-oauth2-oidc';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    importProvidersFrom(
      OAuthModule.forRoot()
    )
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
