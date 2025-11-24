import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAchievementsCardComponent } from './all-achievements-card.component';

describe('AllAchievementsCardComponent', () => {
  let component: AllAchievementsCardComponent;
  let fixture: ComponentFixture<AllAchievementsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllAchievementsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllAchievementsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
