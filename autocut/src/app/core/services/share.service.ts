import { inject, Injectable } from '@angular/core';
import { LoggerService } from './utils/logger.service';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  // MENSAJE PERSONALIZADO
  private baseMessage = "Hey, mira mi nuevo contenido generado en Autocut!";
  private logger: LoggerService = inject(LoggerService);
  // FACEBOOK — NO PERMITE TEXTO EXTRA, SOLO URL
  openFacebookShare(url: string) {
    try {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        '_blank'
      );
    } catch (e) {
      this.logger.error('Error abriendo Facebook:', e);
    }
  }

  // TWITTER / X — PERMITE TEXTO + URL
  openTwitterShare(url: string) {
    const text = `${this.baseMessage} ${url}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  }

  // WHATSAPP — PERMITE TEXTO + URL
  openWhatsAppShare(url: string) {
    const text = `${this.baseMessage}\n${url}`;
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  }

  // INSTAGRAM — SOLO PODEMOS PASAR URL (no acepta mensaje)
  openInstagramShare(url: string) {
    window.open(
      `https://www.instagram.com/?url=${encodeURIComponent(url)}`,
      '_blank'
    );
  }

  // TIKTOK — WebShare API permite título + texto + URL
  openTiktokShare(url: string) {
    if (navigator.share) {
      navigator.share({
        title: 'Mira esto!',
        text: this.baseMessage,
        url: url
      }).catch(err => this.logger.error('Error TikTok Share:', err));
    } else {
      alert("TikTok solo permite compartir desde móvil.");
    }
  }
}
