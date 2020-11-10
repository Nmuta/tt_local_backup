import { Injectable } from '@angular/core';
import { OpusPlayerDetails } from '@models/opus';
import { Observable, of } from 'rxjs';

import { OpusService } from './opus.service';

/** Defines the mock for the API Service. */
@Injectable()
export class MockOpusService {
  public getPlayerDetailsByGamertag = jasmine
    .createSpy('getPlayerDetailsByGamertag')
    .and.returnValue(of({}));
}

export function createMockMockOpusService() {
  return {
    provide: OpusService,
    useValue: new MockOpusService(),
  };
}
