import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../stat-card/stat-card.component';
import { IStat } from '../../../../../core/interfaces';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule, StatCardComponent],
  templateUrl: './features-section.component.html',
})
export class FeaturesSectionComponent {
  stats: IStat[] = [
    { icon: '😊', value: '250+', label: 'Happy customer' },
    { icon: '📋', value: '600+', label: 'Completed projects' },
    { icon: '📊', value: '1.8K+', label: 'Resources' },
    { icon: '👥', value: '11K+', label: 'Subscribers' }
  ];
}

