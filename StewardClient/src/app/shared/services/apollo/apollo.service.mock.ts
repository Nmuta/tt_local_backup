import { Injectable, Provider } from '@angular/core';
import { ApolloPlayersBanFakeApi } from '@interceptors/fake-api/apis/title/apollo/players/ban';
import { defer, of } from 'rxjs';

import { ApolloService } from './apollo.service';

/** Defines the mock for the API Service. */
@Injectable()
export class MockApolloService {
  public getIdentity = jasmine
    .createSpy('getIdentity')
    .and.returnValue(of({ xuid: BigInt(12345), gamertag: 'gamertag' }));

  public getPlayerDetailsByGamertag = jasmine
    .createSpy('getPlayerDetailsByGamertag')
    .and.returnValue(of({ xuid: BigInt(12345) }));

  public postBanPlayers = jasmine
    .createSpy('postBanPlayers')
    .and.returnValue(defer(() => ApolloPlayersBanFakeApi.make()));

  public getMasterInventory = jasmine
      .createSpy('getMasterInventory')
      .and.returnValue(of({}));
}

/** Creates an injectable mock for Apollo Service. */
export function createMockApolloService(): Provider {
  return {
    provide: ApolloService,
    useValue: new MockApolloService(),
  };
}
