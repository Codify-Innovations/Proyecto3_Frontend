import { inject, Injectable } from '@angular/core';
import axios from 'axios';
import { LoggerService } from '../utils/logger.service';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VideoGeneratorService {
  private logger: LoggerService = inject(LoggerService);
  private apiUrl = `${environment.iaApiUrl}/video`;

  
  async generateVideo(
    imageUrls: string[],
    style: string,
    duration: number,
    musicUrl: string | null = null    // ← Valor por defecto
  ): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/generate-edit`, {
        image_urls: imageUrls,
        video_urls: [],               // preparado para videos
        music_url: musicUrl || null,  // siempre válido
        style: style,
        duration: duration,
      });

      return response.data;

    } catch (error) {
      this.logger.error('Error generando video PRO:', error);
      throw error;
    }
  }
}
