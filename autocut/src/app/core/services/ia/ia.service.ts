import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({ providedIn: 'root' })
export class IaService {

  private apiUrl = 'http://127.0.0.1:8000/api/video';

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
      console.error('❌ Error generando video PRO:', error);
      throw error;
    }
  }
}
