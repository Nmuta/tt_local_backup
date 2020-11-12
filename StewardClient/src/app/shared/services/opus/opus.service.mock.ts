import { Injectable, Provider } from '@angular/core';
import { of } from 'rxjs';

import { OpusService } from './opus.service';

/** Defines the mock for the API Service. */
@Injectable()
export class MockOpusService {
  public getPlayerDetailsByGamertag = jasmine
    .createSpy('getPlayerDetailsByGamertag')
    .and.returnValue(of({}));
}

export function createMockMockOpusService(): Provider {
  return {
    provide: OpusService,
    useValue: new MockOpusService(),
  };
}
