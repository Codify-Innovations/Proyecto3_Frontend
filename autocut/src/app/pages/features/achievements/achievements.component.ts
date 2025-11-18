import { Component, computed, inject } from '@angular/core';
import { AllAchievementsListComponent } from '../../../components/achievements/all-achievements-list/all-achievements-list.component';
import { AchievementService } from '../../../core/services/achievement.service';

@Component({
  selector: 'app-achievements',
  imports: [AllAchievementsListComponent],
  templateUrl: './achievements.component.html',
})
export class AchievementsComponent {
  private achievementService = inject(AchievementService);

  all = this.achievementService.allAchievements$;
  unlocked = this.achievementService.achievements$;

  totalCount = computed(() => this.all().length);
  unlockedCount = computed(() => this.unlocked().length);
}
