import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAdminMetricsComponent } from './dashboard-admin-metrics.component';

describe('DashboardAdminMetricsComponent', () => {
  let component: DashboardAdminMetricsComponent;
  let fixture: ComponentFixture<DashboardAdminMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAdminMetricsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAdminMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
