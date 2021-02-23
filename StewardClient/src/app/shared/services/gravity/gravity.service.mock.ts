import { Injectable, Provider } from '@angular/core';
import { GravityPlayerGamertagDetailsFakeApi } from '@interceptors/fake-api/apis/title/gravity/player/gamertag/details';
import { GravityPlayerT10IdDetailsFakeApi } from '@interceptors/fake-api/apis/title/gravity/player/t10Id/details';
import { GravityGiftingPlayerFakeApi } from '@interceptors/fake-api/apis/title/gravity/gifting/players';
import { GravityMasterInventoryFakeApi } from '@interceptors/fake-api/apis/title/gravity/masterInventory';
import { GravityPlayerT10IdInventoryFakeApi } from '@interceptors/fake-api/apis/title/gravity/player/t10Id/inventory';
import { GravityPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/gravity/players/identities';
import { gravitySaveStatesToPsuedoInventoryProfile } from '@models/gravity';
import { IdentityQueryBeta, IdentityQueryBetaBatch } from '@models/identity-query.model';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { GravityService } from './gravity.service';

/** Defines the mock for the Gravity Service. */
@Injectable()
export class MockGravityService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getIdentity = jasmine
    .createSpy('getIdentity')
    .and.callFake(() =>
      this.waitUntil$.pipe(
        switchMap(() => of({ xuid: BigInt(12345), gamertag: 'gamertag', t10Id: '1234567489' })),
      ),
    );

  public getPlayerDetailsByGamertag = jasmine
    .createSpy('getPlayerDetailsByGamertag')
    .and.callFake(_gamertag =>
      this.waitUntil$.pipe(switchMap(() => of(GravityPlayerGamertagDetailsFakeApi.make()))),
    );

  public getPlayerDetailsByT10Id = jasmine
    .createSpy('getPlayerDetailsByT10Id')
    .and.callFake(t10Id =>
      this.waitUntil$.pipe(switchMap(() => of(GravityPlayerT10IdDetailsFakeApi.make(t10Id)))),
    );

  public getPlayerIdentity = jasmine
    .createSpy('getPlayerIdentity')
    .and.callFake((query: IdentityQueryBeta) =>
      this.waitUntil$.pipe(switchMap(() => of(GravityPlayersIdentitiesFakeApi.make([query])))),
    );
  public getPlayerIdentities = jasmine
    .createSpy('getPlayerIdentities')
    .and.callFake((query: IdentityQueryBetaBatch) =>
      this.waitUntil$.pipe(switchMap(() => of(GravityPlayersIdentitiesFakeApi.make(query)))),
    );

  public getMasterInventory = jasmine
    .createSpy('getMasterInventory')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(GravityMasterInventoryFakeApi.make()))),
    );

  public postGiftPlayersUsingBackgroundTask = jasmine
    .createSpy('postGiftPlayersUsingBackgroundTask')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(GravityGiftingPlayerFakeApi.make()))),
    );

  public getPlayerInventoryProfilesByT10Id = jasmine
    .createSpy('getPlayerInventoryProfilesByT10Id')
    .and.callFake(t10Id =>
      this.waitUntil$.pipe(
        switchMap(() =>
          of(
            gravitySaveStatesToPsuedoInventoryProfile(GravityPlayerT10IdDetailsFakeApi.make(t10Id)),
          ),
        ),
      ),
    );

  public getPlayerInventoryByT10Id = jasmine
    .createSpy('getPlayerInventoryByT10Id')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(GravityPlayerT10IdInventoryFakeApi.make()))),
    );
}

/** Creates an injectable mock for Gravity Service. */
export function createMockGravityService(): Provider {
  return {
    provide: GravityService,
    useValue: new MockGravityService(),
  };
}
