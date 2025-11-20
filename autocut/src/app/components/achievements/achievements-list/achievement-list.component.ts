import { Component, Input } from '@angular/core';
import { IUsuarioLogro } from '../../../core/interfaces';
import { CommonModule } from '@angular/common';
import { AchievementsCardComponent } from '../achievements-card/achievement-card.component';

@Component({
  selector: 'app-achievement-list',
  imports: [CommonModule, AchievementsCardComponent],
  templateUrl: './achievement-list.component.html',
})
export class AchievementListComponent {
  @Input() logros: IUsuarioLogro[] = [];
}
