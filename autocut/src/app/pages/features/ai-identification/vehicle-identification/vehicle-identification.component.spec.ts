import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleIdentificationComponent } from './vehicle-identification.component';

describe('VehicleIdentificationComponent', () => {
  let component: VehicleIdentificationComponent;
  let fixture: ComponentFixture<VehicleIdentificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleIdentificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleIdentificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
