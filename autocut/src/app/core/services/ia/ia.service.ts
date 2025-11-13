import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({ providedIn: 'root' })
export class IaService {
    private apiUrl = 'http://127.0.0.1:8000/api/video'; // tu microservicio IA local

    async generateVideo(imageUrls: string[], style: string, duration: number): Promise<any> {
        try {
          const response = await axios.post(`${this.apiUrl}/generate-multiple`, {
            image_urls: imageUrls,
            style: style,
            duration: duration, // ✅ enviar duración
          });
          return response.data;
        } catch (error) {
          console.error('❌ Error generando video con IA:', error);
          throw error;
        }
    }
}
