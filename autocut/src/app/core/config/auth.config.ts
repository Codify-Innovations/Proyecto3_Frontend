import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../../environments/environment.development';

export const googleAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',

  // Tu Client ID de Google
  clientId: environment.googleClientId,

  // Dónde redirigir tras login
  redirectUri: window.location.origin,

  // Qué datos solicitar
  scope: 'openid profile email',

  // Respuesta esperada
  responseType: 'id_token token',

  // Desactivar validación estricta del discovery document
  strictDiscoveryDocumentValidation: false,

  showDebugInformation: true
};
