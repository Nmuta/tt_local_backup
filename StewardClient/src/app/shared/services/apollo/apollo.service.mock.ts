import { Injectable, Provider } from '@angular/core';
import { of } from 'rxjs';

import { ApolloService } from './apollo.service';

/** Defines the mock for the API Service. */
@Injectable()
export class MockApolloService {
  public getIdentity = jasmine
    .createSpy('getIdentity')
    .and.returnValue(of({xuid: BigInt(12345), gamertag: 'gamertag'}));

  public getPlayerDetailsByGamertag = jasmine
    .createSpy('getPlayerDetailsByGamertag')
    .and.returnValue(of({xuid: BigInt(12345), }));
}

/** Creates an injectable mock for Apollo Service. */
export function createMockApolloService(): Provider {
  return {
    provide: ApolloService,
    useValue: new MockApolloService(),
  };
}
