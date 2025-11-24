import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { AllAchievementsCardComponent } from '../all-achievements-card/all-achievements-card.component';
import { AchievementService } from '../../../core/services/achievement.service';

@Component({
  selector: 'app-all-achievements-list',
  standalone: true,
  imports: [CommonModule, AllAchievementsCardComponent],
  templateUrl: './all-achievements-list.component.html',
})
export class AllAchievementsListComponent {
  private achievementService = inject(AchievementService);

  allAchievements = this.achievementService.allAchievements$;

  userAchievements = this.achievementService.achievements$;

  achievementsWithState = computed(() => {
    const unlockedIds = this.userAchievements().map((a) => a.logro.id);

    return this.allAchievements().map((logro) => ({
      logro,
      unlocked: unlockedIds.includes(logro.id),
    }));
  });
}
