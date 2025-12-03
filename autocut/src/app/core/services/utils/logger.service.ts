import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class LoggerService {

    error(message: string, error?: any): void {
        if (!environment.production) {
            console.error(message, error);
        }
    }

    log(message: string, ...args: any[]): void {
        if (!environment.production) {
            console.log(message, ...args);
        }
    }

    warn(message: string, ...args: any[]): void {
        if (!environment.production) {
            console.warn(message, ...args);
        }
    }
}