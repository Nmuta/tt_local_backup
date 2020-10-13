import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { GravityService } from './gravity.service';

/** Defines the mock for the API Service. */
@Injectable()
export class MockGravityService {}

export function createMockGravityService() {
  return {
    provide: GravityService,
    useValue: new MockGravityService(),
  };
}
