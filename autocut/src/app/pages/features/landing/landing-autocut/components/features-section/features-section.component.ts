import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../stat-card/stat-card.component';
import { IStat } from '../../../../../../core/interfaces';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule, StatCardComponent, TranslateModule],
  templateUrl: './features-section.component.html',
})
export class FeaturesSectionComponent {
  stats: IStat[] = [
    { icon: '😊', value: '250+', label: 'FEATURES_SECTION.STATS.HAPPY_CUSTOMERS' },
    { icon: '📋', value: '600+', label: 'FEATURES_SECTION.STATS.COMPLETED_PROJECTS' },
    { icon: '📊', value: '1.8K+', label: 'FEATURES_SECTION.STATS.RESOURCES' },
    { icon: '👥', value: '11K+', label: 'FEATURES_SECTION.STATS.SUBSCRIBERS' },
  ];
}
