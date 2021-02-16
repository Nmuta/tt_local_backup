import { Injectable, Provider } from '@angular/core';
import { ApolloPlayersBanFakeApi } from '@interceptors/fake-api/apis/title/apollo/players/ban';
import { ApolloPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/apollo/players/identities';
import { IdentityQueryAlpha, IdentityQueryAlphaBatch } from '@models/identity-query.model';
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
  public getPlayerIdentity = jasmine
    .createSpy('getPlayerIdentity')
    .and.callFake((query: IdentityQueryAlpha) =>
      defer(() => of(ApolloPlayersIdentitiesFakeApi.make([query]))),
    );
  public getPlayerIdentities = jasmine
    .createSpy('getPlayerIdentities')
    .and.callFake((query: IdentityQueryAlphaBatch) =>
      defer(() => of(ApolloPlayersIdentitiesFakeApi.make(query))),
    );

  public getMasterInventory = jasmine.createSpy('getMasterInventory').and.returnValue(of({}));
}

/** Creates an injectable mock for Apollo Service. */
export function createMockApolloService(): Provider {
  return {
    provide: ApolloService,
    useValue: new MockApolloService(),
  };
}
