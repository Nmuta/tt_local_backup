import BigNumber from 'bignumber.js';
import { Injectable, Provider } from '@angular/core';
import { SteelheadGiftingLspGroupFakeApi } from '@interceptors/fake-api/apis/title/steelhead/gifting/groupId';
import { SteelheadGiftingPlayersFakeApi } from '@interceptors/fake-api/apis/title/steelhead/gifting/players';
import { SteelheadPlayerXuidBanHistoryFakeApi } from '@interceptors/fake-api/apis/title/steelhead/player/xuid/banHistory';
import { SteelheadPlayerXuidInventoryFakeApi } from '@interceptors/fake-api/apis/title/steelhead/player/xuid/inventory';
import { SteelheadPlayerXuidInventoryProfilesFakeApi } from '@interceptors/fake-api/apis/title/steelhead/player/xuid/inventoryProfiles';
import { SteelheadPlayersBanFakeApi } from '@interceptors/fake-api/apis/title/steelhead/players/ban';
import { SteelheadPlayersBanWithBackgroundProcessingFakeApi } from '@interceptors/fake-api/apis/title/steelhead/players/ban_backgroundProcessing';
import { SteelheadPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/steelhead/players/identities';
import { IdentityQueryAlpha, IdentityQueryAlphaBatch } from '@models/identity-query.model';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { SteelheadService } from './steelhead.service';
import { SteelheadPlayerXuidAuctionsFakeApi } from '@interceptors/fake-api/apis/title/steelhead/player/xuid/auctions';
import { SteelheadPlayerXuidUGCFakeApi } from '@interceptors/fake-api/apis/title/steelhead/player/xuid/ugc';

/** Defines the mock for the API Service. */
@Injectable()
export class MockSteelheadService {
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
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of({ xuid: new BigNumber(12345) }))));

  public postBanPlayers$ = jasmine
    .createSpy('postBanPlayers')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(SteelheadPlayersBanFakeApi.make()))),
    );
  public getBanHistoryByXuid$ = jasmine
    .createSpy('getBanHistoryByXuid')
    .and.callFake(xuid =>
      this.waitUntil$.pipe(switchMap(() => of(SteelheadPlayerXuidBanHistoryFakeApi.make(xuid)))),
    );
  public postBanPlayersWithBackgroundProcessing$ = jasmine
    .createSpy('postBanPlayersWithBackgroundProcessing')
    .and.callFake(() =>
      this.waitUntil$.pipe(
        switchMap(() => of(SteelheadPlayersBanWithBackgroundProcessingFakeApi.make())),
      ),
    );

  public getPlayerIdentity$ = jasmine
    .createSpy('getPlayerIdentity')
    .and.callFake((query: IdentityQueryAlpha) =>
      this.waitUntil$.pipe(switchMap(() => of(SteelheadPlayersIdentitiesFakeApi.make([query])))),
    );
  public getPlayerIdentities$ = jasmine
    .createSpy('getPlayerIdentities')
    .and.callFake((query: IdentityQueryAlphaBatch) =>
      this.waitUntil$.pipe(switchMap(() => of(SteelheadPlayersIdentitiesFakeApi.make(query)))),
    );

  public getMasterInventory$ = jasmine
    .createSpy('getMasterInventory')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of({}))));

  public getPlayerInventoryProfilesByXuid$ = jasmine
    .createSpy('getPlayerInventoryProfilesByXuid')
    .and.callFake(_xuid =>
      this.waitUntil$.pipe(switchMap(() => of(SteelheadPlayerXuidInventoryProfilesFakeApi.make()))),
    );

  public postGiftPlayers$ = jasmine
    .createSpy('postGiftPlayers')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(SteelheadGiftingPlayersFakeApi.make()))),
    );

  public postGiftPlayersUsingBackgroundTask$ = jasmine
    .createSpy('postGiftPlayersUsingBackgroundTask')
    .and.returnValue(of('fake-job-id'));

  public postGiftLspGroup$ = jasmine
    .createSpy('postGiftLspGroup')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(SteelheadGiftingLspGroupFakeApi.make()))),
    );

  public getPlayerInventoryByXuid$ = jasmine
    .createSpy('getPlayerInventoryByXuid')
    .and.callFake(xuid =>
      this.waitUntil$.pipe(switchMap(() => of(SteelheadPlayerXuidInventoryFakeApi.make(xuid)))),
    );

  public getPlayerAuctionsByXuid$ = jasmine
    .createSpy('getPlayerAuctionsByXuid$')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(SteelheadPlayerXuidAuctionsFakeApi.makeMany()))),
    );

  public getPlayerUGCByXuid$ = jasmine
    .createSpy('getPlayerUGCByXuid$')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(SteelheadPlayerXuidUGCFakeApi.makeMany()))),
    );

  public getPlayerUGCByShareCode$ = jasmine
    .createSpy('getPlayerUGCByShareCode$')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(SteelheadPlayerXuidUGCFakeApi.makeMany()))),
    );
}
/** Creates an injectable mock for Steelhead Service. */
export function createMockSteelheadService(): Provider {
  return {
    provide: SteelheadService,
    useValue: new MockSteelheadService(),
  };
}
