import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAchievementsListComponent } from './all-achievements-list.component';

describe('AllAchievementsListComponent', () => {
  let component: AllAchievementsListComponent;
  let fixture: ComponentFixture<AllAchievementsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllAchievementsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllAchievementsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
