import { Injectable, Provider } from '@angular/core';
import { of } from 'rxjs';

import { OpusService } from './opus.service';

/** Defines the mock for the API Service. */
@Injectable()
export class MockOpusService {
  public getIdentity = jasmine
    .createSpy('getIdentity')
    .and.returnValue(of({ xuid: BigInt(12345), gamertag: 'gamertag' }));

  public getPlayerDetailsByGamertag = jasmine
    .createSpy('getPlayerDetailsByGamertag')
    .and.returnValue(of({}));
}

/** Creates an injectable mock for Opus Service. */
export function createMockOpusService(): Provider {
  return {
    provide: OpusService,
    useValue: new MockOpusService(),
  };
}
