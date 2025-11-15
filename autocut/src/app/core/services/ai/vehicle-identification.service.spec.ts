import { TestBed } from '@angular/core/testing';

import { VehicleIdentificationService } from './vehicle-identification.service';

describe('VehicleIdentificationService', () => {
  let service: VehicleIdentificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleIdentificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
