import { Component, Input } from '@angular/core';
import { ILogro } from '../../../core/interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-achievement-card',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './achievement-card.component.html',
})
export class AchievementsCardComponent {
  @Input() logro!: ILogro;
  @Input() fechaDesbloqueo!: string;
}
