import { Component, Input } from '@angular/core';
import { ShareService } from '../../..//core/services/share.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-share-button', 
  standalone: true,           
  imports: [CommonModule],  
  templateUrl: './share-button.component.html'
})
export class ShareButtonComponent {

  @Input() url!: string;
  menuOpen = false;

  constructor(private shareService: ShareService) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  share(platform: string) {
    switch (platform) {
      case 'facebook': this.shareService.openFacebookShare(this.url); break;
      case 'twitter': this.shareService.openTwitterShare(this.url); break;
      case 'whatsapp': this.shareService.openWhatsAppShare(this.url); break;
      case 'instagram': this.shareService.openInstagramShare(this.url); break;
      case 'tiktok': this.shareService.openTiktokShare(this.url); break;
    }
    this.menuOpen = false;
  }
}
