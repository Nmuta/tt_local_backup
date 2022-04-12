import BigNumber from 'bignumber.js';
import { ValueProvider } from '@angular/core';
import { WoodstockGiftingLspGroupFakeApi } from '@interceptors/fake-api/apis/title/woodstock/gifting/groupId';
import { WoodstockGiftingPlayersFakeApi } from '@interceptors/fake-api/apis/title/woodstock/gifting/players';
import { WoodstockMasterInventoryFakeApi } from '@interceptors/fake-api/apis/title/woodstock/masterInventory';
import { WoodstockPlayerXuidBanHistoryFakeApi } from '@interceptors/fake-api/apis/title/woodstock/player/xuid/banHistory';
import { WoodstockPlayerXuidInventoryFakeApi } from '@interceptors/fake-api/apis/title/woodstock/player/xuid/inventory';
import { WoodstockPlayerXuidInventoryProfilesFakeApi } from '@interceptors/fake-api/apis/title/woodstock/player/xuid/inventoryProfiles';
import { WoodstockPlayersBanFakeApi } from '@interceptors/fake-api/apis/title/woodstock/players/ban';
import { WoodstockPlayersBanSummariesFakeApi } from '@interceptors/fake-api/apis/title/woodstock/players/ban-summaries';
import { WoodstockPlayersBanWithBackgroundProcessingFakeApi } from '@interceptors/fake-api/apis/title/woodstock/players/ban_backgroundProcessing';
import { WoodstockPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/woodstock/players/identities';
import { IdentityQueryAlpha, IdentityQueryAlphaBatch } from '@models/identity-query.model';
import { WoodstockBanHistory } from '@models/woodstock';
import _ from 'lodash';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { WoodstockService } from './woodstock.service';
import { WoodstockPlayerXuidProfileRollbacksApi } from '@interceptors/fake-api/apis/title/woodstock/player/xuid/profileRollbacks';
import { WoodstockPlayerXuidAuctionsFakeApi } from '@interceptors/fake-api/apis/title/woodstock/player/xuid/auctions';
import { WoodstockPlayerXuidBackstagePassHistoryFakeApi } from '@interceptors/fake-api/apis/title/woodstock/player/xuid/backstagePassHistory';
import { WoodstockPlayerXuidAccountInventoryFakeApi } from '@interceptors/fake-api/apis/title/woodstock/player/xuid/accountInventory';
import { WoodstockPlayerXuidUgcFakeApi } from '@interceptors/fake-api/apis/title/woodstock/player/xuid/ugc';
import { WoodstockDetailedCarsFakeApi } from '@interceptors/fake-api/apis/title/woodstock/kusto/cars';
import { WoodstockGiftLiveryToPlayersFakeApi } from '@interceptors/fake-api/apis/title/woodstock/gifting/livery/useBackgroundProcessing/players';
import { WoodstockGiftLiveryToLspGroupFakeApi } from '@interceptors/fake-api/apis/title/woodstock/gifting/livery/groupId';
import { WoodstockPlayerXuidProfileNotesApi } from '@interceptors/fake-api/apis/title/woodstock/player/xuid/profileNotes';

/** Defines the mock for the API Service. */
export class MockWoodstockService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getIdentity$ = jasmine
    .createSpy('getIdentity$')
    .and.callFake(() =>
      this.waitUntil$.pipe(
        switchMap(() => of({ xuid: new BigNumber(12345), gamertag: 'gamertag' })),
      ),
    );

  public getPlayerDetailsByGamertag$ = jasmine
    .createSpy('getPlayerDetailsByGamertag$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator$())))));
  public getFlagsByXuid$ = jasmine
    .createSpy('getFlagsByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator$())))));
  public putFlagsByXuid$ = jasmine
    .createSpy('putFlagsByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator$())))));
  public getBanHistoryByXuid$ = jasmine.createSpy('getBanHistoryByXuid$').and.callFake(() => {
    const unprocessed = WoodstockPlayerXuidBanHistoryFakeApi.make(
      new BigNumber(12345),
    ) as unknown as WoodstockBanHistory;

    return of(unprocessed);
  });
  public getSharedConsoleUsersByXuid$ = jasmine
    .createSpy('getSharedConsoleUsersByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator$())))));
  public getConsoleDetailsByXuid$ = jasmine
    .createSpy('getConsoleDetailsByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator$())))));
  public putBanStatusByConsoleId$ = jasmine
    .createSpy('putBanStatusByConsoleId$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator$())))));
  public getProfileSummaryByXuid$ = jasmine
    .createSpy('getProfileSummaryByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator$())))));
  public getCreditHistoryByXuid$ = jasmine
    .createSpy('getCreditHistoryByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator$())))));
  public getPlayerNotificationsByXuid$ = jasmine
    .createSpy('getPlayerNotificationsByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator$())))));
  public postBanPlayers$ = jasmine
    .createSpy('postBanPlayers$')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(WoodstockPlayersBanFakeApi.make()))),
    );
  public postBanPlayersWithBackgroundProcessing$ = jasmine
    .createSpy('postBanPlayersWithBackgroundProcessing$')
    .and.callFake(() =>
      this.waitUntil$.pipe(
        switchMap(() => of(WoodstockPlayersBanWithBackgroundProcessingFakeApi.make())),
      ),
    );
  public getBanSummariesByXuids$ = jasmine
    .createSpy('getBanSummariesByXuids$')
    .and.callFake((xuids: BigNumber[]) =>
      this.waitUntil$.pipe(switchMap(() => of(WoodstockPlayersBanSummariesFakeApi.make(xuids)))),
    );
  public getMasterInventory$ = jasmine
    .createSpy('getMasterInventory$')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(WoodstockMasterInventoryFakeApi.make()))),
    );

  public getPlayerIdentity$ = jasmine
    .createSpy('getPlayerIdentity$')
    .and.callFake((query: IdentityQueryAlpha) =>
      this.waitUntil$.pipe(switchMap(() => of(WoodstockPlayersIdentitiesFakeApi.make([query])))),
    );
  public getPlayerIdentities$ = jasmine
    .createSpy('getPlayerIdentities$')
    .and.callFake((query: IdentityQueryAlphaBatch) =>
      this.waitUntil$.pipe(switchMap(() => of(WoodstockPlayersIdentitiesFakeApi.make(query)))),
    );

  public getPlayerInventoryProfilesByXuid$ = jasmine
    .createSpy('getPlayerInventoryProfilesByXuid$')
    .and.callFake(_xuid =>
      this.waitUntil$.pipe(switchMap(() => of(WoodstockPlayerXuidInventoryProfilesFakeApi.make()))),
    );

  public getPlayerInventoryByXuid$ = jasmine
    .createSpy('getPlayerInventoryByXuid$')
    .and.callFake(xuid =>
      this.waitUntil$.pipe(switchMap(() => of(WoodstockPlayerXuidInventoryFakeApi.make(xuid)))),
    );

  public postGiftPlayers$ = jasmine
    .createSpy('postGiftPlayers$')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(WoodstockGiftingPlayersFakeApi.make()))),
    );

  public postGiftPlayersUsingBackgroundTask$ = jasmine
    .createSpy('postGiftPlayersUsingBackgroundTask$')
    .and.returnValue(of('fake-job-id'));

  public postGiftLspGroup$ = jasmine
    .createSpy('postGiftLspGroup$')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(WoodstockGiftingLspGroupFakeApi.make()))),
    );
  public getProfileRollbacksXuid$ = jasmine
    .createSpy('getProfileRollbacksXuid$')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(WoodstockPlayerXuidProfileRollbacksApi.makeMany()))),
    );

  public getPlayerAuctionsByXuid$ = jasmine
    .createSpy('getPlayerAuctionsByXuid$')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(WoodstockPlayerXuidAuctionsFakeApi.makeMany()))),
    );

  public getBackstagePassHistoryByXuid$ = jasmine
    .createSpy('getBackstagePassHistoryByXuid')
    .and.callFake(() =>
      this.waitUntil$.pipe(
        switchMap(() => of(WoodstockPlayerXuidBackstagePassHistoryFakeApi.makeMany())),
      ),
    );

  public getPlayerAccountInventoryByXuid$ = jasmine
    .createSpy('getPlayerAccountInventoryByXuid')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(WoodstockPlayerXuidAccountInventoryFakeApi.make()))),
    );

  public getPlayerUgcByXuid$ = jasmine
    .createSpy('getPlayerUgcByXuid$')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(WoodstockPlayerXuidUgcFakeApi.makeMany()))),
    );

  public getPlayerUgcByShareCode$ = jasmine
    .createSpy('getPlayerUgcByShareCode$')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(WoodstockPlayerXuidUgcFakeApi.makeMany()))),
    );

  public getDetailedCars$ = jasmine
    .createSpy('getDetailedCars')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(WoodstockDetailedCarsFakeApi.make()))),
    );
  public getProfileNotesXuid$ = jasmine
    .createSpy('getProfileNotesXuid')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(WoodstockPlayerXuidProfileNotesApi.makeMany()))),
    );
  public getAuctionDataByAuctionId$ = jasmine
    .createSpy('getAuctionDataByAuctionId$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public getPlayerAuctionLogByXuid$ = jasmine
    .createSpy('getPlayerAuctionLogByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public getLeaderboards$ = jasmine
    .createSpy('getLeaderboards$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public getLeaderboardScores$ = jasmine
    .createSpy('getLeaderboardScores$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public getLeaderboardScoresNearPlayer$ = jasmine
    .createSpy('getLeaderboardScoresNearPlayer$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public deleteLeaderboardScores$ = jasmine
    .createSpy('deleteLeaderboardScores$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public postGiftLiveryToPlayersUsingBackgroundJob$ = jasmine
    .createSpy('postGiftLiveryToPlayersUsingBackgroundJob$')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(WoodstockGiftLiveryToPlayersFakeApi.make()))),
    );

  public postGiftLiveryToLspGroup$ = jasmine
    .createSpy('postGiftLiveryToLspGroup$')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(WoodstockGiftLiveryToLspGroupFakeApi.make()))),
    );

  public hideUgc$ = jasmine
    .createSpy('hideUgc$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public unhideUgc$ = jasmine
    .createSpy('unhideUgc$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Service. */
export function createMockWoodstockService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: WoodstockService,
    useValue: new MockWoodstockService(returnValueGenerator),
  };
}
