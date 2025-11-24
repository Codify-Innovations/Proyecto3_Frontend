import { Component, Input } from '@angular/core';
import { ILogro } from '../../../core/interfaces';

@Component({
  selector: 'app-all-achievements-card',
  standalone: true,
  imports: [],
  templateUrl: './all-achievements-card.component.html',
})
export class AllAchievementsCardComponent {
  @Input() logro!: ILogro;
  @Input() unlocked: boolean = false;
}
