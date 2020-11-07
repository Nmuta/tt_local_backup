import { Injectable } from '@angular/core';
import { SunrisePlayerDetails } from '@models/apollo';
import { Observable, of } from 'rxjs';

import { ApolloService } from './apollo.service';

/** Defines the mock for the API Service. */
@Injectable()
export class MockApolloService {
  public getPlayerDetailsByGamertag = jasmine
    .createSpy('getPlayerDetailsByGamertag')
    .and.returnValue(of({}));
}

export function createMockMockApolloService() {
  return {
    provide: ApolloService,
    useValue: new MockApolloService(),
  };
}
