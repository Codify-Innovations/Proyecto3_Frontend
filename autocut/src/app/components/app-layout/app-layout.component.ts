import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarClientComponent } from '../shared/navbar-client/navbar-client.component';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../core/services/layout.service';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarClientComponent,
  ],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent {
  public title?: string;
  public AutoCutLogo = '/logo/AutoCut_Logo.png';

  constructor(public layoutService: LayoutService) {
    this.layoutService.title.subscribe((title) => (this.title = title));
  }
}
