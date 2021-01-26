import { Injectable, Provider } from '@angular/core';
import { of } from 'rxjs';

import { GravityService } from './gravity.service';

/** Defines the mock for the Gravity Service. */
@Injectable()
export class MockGravityService {
  public getIdentity = jasmine
    .createSpy('getIdentity')
    .and.returnValue(of({ xuid: BigInt(12345), gamertag: 'gamertag', t10Id: '1234567489' }));

  public getPlayerDetailsByGamertag = jasmine
    .createSpy('getPlayerDetailsByGamertag')
    .and.returnValue(of({}));
}

/** Creates an injectable mock for Gravity Service. */
export function createMockGravityService(): Provider {
  return {
    provide: GravityService,
    useValue: new MockGravityService(),
  };
}
