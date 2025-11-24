import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRankinComponent } from './dashboard-ranking.component';

describe('DashboardRankinComponent', () => {
  let component: DashboardRankinComponent;
  let fixture: ComponentFixture<DashboardRankinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRankinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardRankinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
