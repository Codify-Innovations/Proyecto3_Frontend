import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementsCardComponent } from './achievement-card.component';

describe('AchievementsCardComponent', () => {
  let component: AchievementsCardComponent;
  let fixture: ComponentFixture<AchievementsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AchievementsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
