import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({ providedIn: 'root' })
export class IaService {
  private apiUrl = 'http://127.0.0.1:8000/api/video';

  async generateVideo(
    urls: string[],
    style: string,
    duration: number,
    musicUrl?: string
  ): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/generate-edit`, {
        image_urls: urls,
        video_urls: [],
        music_url: musicUrl ?? undefined,
        style,
        duration
      });

      return response.data;

    } catch (error) {
      console.error('❌ Error generando video PRO:', error);
      throw error;
    }
  }
}
