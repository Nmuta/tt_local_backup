import { Injectable, Provider } from '@angular/core';
import { GravityPlayerT10IdInventoryFakeApi } from '@interceptors/fake-api/apis/title/gravity/player/t10Id/inventory';
import { GravityPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/gravity/players/identities';
import { IdentityQueryBeta, IdentityQueryBetaBatch } from '@models/identity-query.model';
import { defer, of } from 'rxjs';

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

  public getPlayerIdentity = jasmine
    .createSpy('getPlayerIdentity')
    .and.callFake((query: IdentityQueryBeta) =>
      defer(() => of(GravityPlayersIdentitiesFakeApi.make([query]))),
    );
  public getPlayerIdentities = jasmine
    .createSpy('getPlayerIdentities')
    .and.callFake((query: IdentityQueryBetaBatch) =>
      defer(() => of(GravityPlayersIdentitiesFakeApi.make(query))),
    );
  public getGameSettings = jasmine.createSpy('getGameSettings').and.returnValue(of({}));

  public getPlayerInventoryByT10Id = jasmine
    .createSpy('getPlayerInventoryByT10Id')
    .and.callFake(t10Id => defer(() => of(GravityPlayerT10IdInventoryFakeApi.make(t10Id))));
}

/** Creates an injectable mock for Gravity Service. */
export function createMockGravityService(): Provider {
  return {
    provide: GravityService,
    useValue: new MockGravityService(),
  };
}
