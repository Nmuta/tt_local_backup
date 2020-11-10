import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { GravityService } from './gravity.service';

/** Defines the mock for the Gravity Service. */
@Injectable()
export class MockGravityService {
  public getPlayerDetailsByGamertag = jasmine
    .createSpy('getPlayerDetailsByGamertag')
    .and.returnValue(of({}));
}

export function createMockGravityService() {
  return {
    provide: GravityService,
    useValue: new MockGravityService(),
  };
}
