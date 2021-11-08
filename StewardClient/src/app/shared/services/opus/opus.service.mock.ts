import BigNumber from 'bignumber.js';
import { Injectable, ValueProvider } from '@angular/core';
import { OpusPlayerXuidInventoryFakeApi } from '@interceptors/fake-api/apis/title/opus/player/xuid/inventory';
import { OpusPlayerXuidInventoryProfilesFakeApi } from '@interceptors/fake-api/apis/title/opus/player/xuid/inventoryProfiles';
import { OpusPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/opus/players/identities';
import { IdentityQueryAlpha, IdentityQueryAlphaBatch } from '@models/identity-query.model';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { OpusService } from './opus.service';

/** Defines the mock for the API Service. */
@Injectable()
export class MockOpusService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getIdentity$ = jasmine
    .createSpy('getIdentity')
    .and.callFake(() =>
      this.waitUntil$.pipe(
        switchMap(() => of({ xuid: new BigNumber(12345), gamertag: 'gamertag' })),
      ),
    );

  public getPlayerDetailsByGamertag$ = jasmine
    .createSpy('getPlayerDetailsByGamertag')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of({}))));

  public getPlayerIdentity$ = jasmine
    .createSpy('getPlayerIdentity')
    .and.callFake((query: IdentityQueryAlpha) =>
      this.waitUntil$.pipe(switchMap(() => of(OpusPlayersIdentitiesFakeApi.make([query])))),
    );
  public getPlayerIdentities$ = jasmine
    .createSpy('getPlayerIdentities')
    .and.callFake((query: IdentityQueryAlphaBatch) =>
      this.waitUntil$.pipe(switchMap(() => of(OpusPlayersIdentitiesFakeApi.make(query)))),
    );

  public getPlayerInventoryProfilesByXuid$ = jasmine
    .createSpy('getPlayerInventoryProfilesByXuid')
    .and.callFake(_xuid =>
      this.waitUntil$.pipe(switchMap(() => of(OpusPlayerXuidInventoryProfilesFakeApi.make()))),
    );

  public getPlayerInventoryByXuid$ = jasmine
    .createSpy('getPlayerInventoryByXuid')
    .and.callFake(xuid =>
      this.waitUntil$.pipe(switchMap(() => of(OpusPlayerXuidInventoryFakeApi.make(xuid)))),
    );
}

/** Creates an injectable mock for Opus Service. */
export function createMockOpusService(): ValueProvider {
  return {
    provide: OpusService,
    useValue: new MockOpusService(),
  };
}
