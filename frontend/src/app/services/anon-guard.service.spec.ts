import { TestBed } from '@angular/core/testing';

import { AnonGuardService } from './anon-guard.service';

describe('AnonGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnonGuardService = TestBed.get(AnonGuardService);
    expect(service).toBeTruthy();
  });
});
