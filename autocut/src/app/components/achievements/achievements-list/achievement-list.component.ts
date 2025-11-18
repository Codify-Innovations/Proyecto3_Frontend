import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IUsuarioLogro } from '../../../core/interfaces';
import { CommonModule } from '@angular/common';
import { AchievementsCardComponent } from '../achievements-card/achievement-card.component';
import { register } from 'swiper/element/bundle';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';
register();

@Component({
  selector: 'app-achievement-list',
  imports: [CommonModule, AchievementsCardComponent, LucideAngularModule],
  templateUrl: './achievement-list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AchievementListComponent {
  icons = { ChevronLeft, ChevronRight };

  @Input() logros: IUsuarioLogro[] = [];
}
