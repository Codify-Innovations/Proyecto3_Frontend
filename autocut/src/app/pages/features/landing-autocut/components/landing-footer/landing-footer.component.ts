import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './landing-footer.component.html',
})
export class LandingFooterComponent {
  currentYear: number = new Date().getFullYear();
}

