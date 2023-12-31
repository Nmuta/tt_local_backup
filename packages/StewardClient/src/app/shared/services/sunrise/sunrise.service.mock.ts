import BigNumber from 'bignumber.js';
import { ValueProvider } from '@angular/core';
import { SunriseGiftingLspGroupFakeApi } from '@interceptors/fake-api/apis/title/sunrise/gifting/groupId';
import { SunriseGiftingPlayersFakeApi } from '@interceptors/fake-api/apis/title/sunrise/gifting/players';
import { SunriseMasterInventoryFakeApi } from '@interceptors/fake-api/apis/title/sunrise/masterInventory';
import { SunrisePlayerXuidBanHistoryFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/banHistory';
import { SunrisePlayerXuidInventoryFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/inventory';
import { SunrisePlayerXuidInventoryProfilesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/inventoryProfiles';
import { SunrisePlayersBanFakeApi } from '@interceptors/fake-api/apis/title/sunrise/players/ban';
import { SunrisePlayersBanSummariesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/players/ban-summaries';
import { SunrisePlayersBanWithBackgroundProcessingFakeApi } from '@interceptors/fake-api/apis/title/sunrise/players/ban_backgroundProcessing';
import { SunrisePlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/players/identities';
import { IdentityQueryAlpha, IdentityQueryAlphaBatch } from '@models/identity-query.model';
import { SunriseBanHistory } from '@models/sunrise';
import _ from 'lodash';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { SunriseService } from './sunrise.service';
import { SunrisePlayerXuidBackstagePassHistoryFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/backstagePassHistory';
import { SunrisePlayerXuidAccountInventoryFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/accountInventory';
import { SunrisePlayerXuidUgcFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/ugc';
import { SunriseSimpleCarsFakeApi } from '@interceptors/fake-api/apis/title/sunrise/kusto/cars';
import { SunriseGiftLiveryToLspGroupFakeApi } from '@interceptors/fake-api/apis/title/sunrise/gifting/livery/groupId';
import { SunriseAuctionBlocklistFakeApi } from '@interceptors/fake-api/apis/title/sunrise/auctionBlocklist';
import { SunriseGiftLiveryToPlayersFakeApi } from '@interceptors/fake-api/apis/title/sunrise/gifting/livery/useBackgroundProcessing/players';

/** Defines the mock for the API Service. */
export class MockSunriseService {
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
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator())))));
  public getFlagsByXuid$ = jasmine
    .createSpy('getFlagsByXuid')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator())))));
  public putFlagsByXuid$ = jasmine
    .createSpy('putFlagsByXuid')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator())))));
  public getBanHistoryByXuid$ = jasmine.createSpy('getBanHistoryByXuid').and.callFake(() => {
    const unprocessed = SunrisePlayerXuidBanHistoryFakeApi.make(
      new BigNumber(12345),
    ) as unknown as SunriseBanHistory;

    return of(unprocessed);
  });
  public getSharedConsoleUsersByXuid$ = jasmine
    .createSpy('getSharedConsoleUsersByXuid')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator())))));
  public getConsoleDetailsByXuid$ = jasmine
    .createSpy('getConsoleDetailsByXuid')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator())))));
  public putBanStatusByConsoleId$ = jasmine
    .createSpy('putBanStatusByConsoleId')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator())))));
  public getProfileSummaryByXuid$ = jasmine
    .createSpy('getProfileSummaryByXuid')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator())))));
  public getCreditHistoryByXuid$ = jasmine
    .createSpy('getCreditHistoryByXuid')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator())))));
  public getPlayerNotificationsByXuid$ = jasmine
    .createSpy('getPlayerNotificationsByXuid')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator())))));
  public postBanPlayers$ = jasmine
    .createSpy('postBanPlayers')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(SunrisePlayersBanFakeApi.make()))));
  public postBanPlayersWithBackgroundProcessing$ = jasmine
    .createSpy('postBanPlayersWithBackgroundProcessing')
    .and.callFake(() =>
      this.waitUntil$.pipe(
        switchMap(() => of(SunrisePlayersBanWithBackgroundProcessingFakeApi.make())),
      ),
    );
  public getBanSummariesByXuids$ = jasmine
    .createSpy('getBanSummariesByXuids')
    .and.callFake((xuids: BigNumber[]) =>
      this.waitUntil$.pipe(switchMap(() => of(SunrisePlayersBanSummariesFakeApi.make(xuids)))),
    );
  public getMasterInventory$ = jasmine
    .createSpy('getMasterInventory')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(SunriseMasterInventoryFakeApi.make()))),
    );

  public getPlayerIdentity$ = jasmine
    .createSpy('getPlayerIdentity')
    .and.callFake((query: IdentityQueryAlpha) =>
      this.waitUntil$.pipe(switchMap(() => of(SunrisePlayersIdentitiesFakeApi.make([query])))),
    );
  public getPlayerIdentities$ = jasmine
    .createSpy('getPlayerIdentities')
    .and.callFake((query: IdentityQueryAlphaBatch) =>
      this.waitUntil$.pipe(switchMap(() => of(SunrisePlayersIdentitiesFakeApi.make(query)))),
    );

  public getPlayerInventoryProfilesByXuid$ = jasmine
    .createSpy('getPlayerInventoryProfilesByXuid')
    .and.callFake(_xuid =>
      this.waitUntil$.pipe(switchMap(() => of(SunrisePlayerXuidInventoryProfilesFakeApi.make()))),
    );

  public getPlayerInventoryByXuid$ = jasmine
    .createSpy('getPlayerInventoryByXuid')
    .and.callFake(xuid =>
      this.waitUntil$.pipe(switchMap(() => of(SunrisePlayerXuidInventoryFakeApi.make(xuid)))),
    );

  public postGiftPlayers$ = jasmine
    .createSpy('postGiftPlayers')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(SunriseGiftingPlayersFakeApi.make()))),
    );

  public postGiftPlayersUsingBackgroundTask$ = jasmine
    .createSpy('postGiftPlayersUsingBackgroundTask')
    .and.returnValue(of('fake-job-id'));

  public postGiftLspGroup$ = jasmine
    .createSpy('postGiftLspGroup')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(SunriseGiftingLspGroupFakeApi.make()))),
    );
  public getPlayerAuctionsByXuid$ = jasmine
    .createSpy('getPlayerAuctionsByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator())))));

  public getBackstagePassHistoryByXuid$ = jasmine
    .createSpy('getBackstagePassHistoryByXuid')
    .and.callFake(() =>
      this.waitUntil$.pipe(
        switchMap(() => of(SunrisePlayerXuidBackstagePassHistoryFakeApi.makeMany())),
      ),
    );

  public getPlayerAccountInventoryByXuid$ = jasmine
    .createSpy('getPlayerAccountInventoryByXuid')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(SunrisePlayerXuidAccountInventoryFakeApi.make()))),
    );

  public getPlayerUgcByXuid$ = jasmine
    .createSpy('getPlayerUgcByXuid$')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(SunrisePlayerXuidUgcFakeApi.makeMany()))),
    );

  public getPlayerUgcByShareCode$ = jasmine
    .createSpy('getPlayerUgcByShareCode$')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(SunrisePlayerXuidUgcFakeApi.makeMany()))),
    );

  public getPlayerUgcItem$ = jasmine
    .createSpy('getPlayerUgcItem$')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(SunrisePlayerXuidUgcFakeApi.makeMany()[0]))),
    );

  public getSimpleCars$ = jasmine
    .createSpy('getSimpleCars')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(SunriseSimpleCarsFakeApi.make()))));

  public postGiftLiveryToPlayersUsingBackgroundJob$ = jasmine
    .createSpy('postGiftLiveryToPlayersUsingBackgroundJob$')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(SunriseGiftLiveryToPlayersFakeApi.make()))),
    );

  public postGiftLiveryToLspGroup$ = jasmine
    .createSpy('postGiftLiveryToLspGroup$')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(SunriseGiftLiveryToLspGroupFakeApi.make()))),
    );

  public getAuctionBlocklist$ = jasmine
    .createSpy('getAuctionBlocklist')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(SunriseAuctionBlocklistFakeApi.make()))),
    );

  public postAuctionBlocklistEntries$ = jasmine
    .createSpy('postAuctionBlocklistEntries')
    .and.callFake(() => this.waitUntil$.pipe());

  public deleteAuctionBlocklistEntry$ = jasmine
    .createSpy('deleteAuctionBlocklistEntry')
    .and.callFake(() => this.waitUntil$.pipe());

  public getAuctionDataByAuctionId$ = jasmine
    .createSpy('getAuctionDataByAuctionId$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public getPlayerAuctionLogByXuid$ = jasmine
    .createSpy('getPlayerAuctionLogByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public hideUgc$ = jasmine
    .createSpy('hideUgc$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public unhideUgc$ = jasmine
    .createSpy('unhideUgc$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator: () => unknown) {}
}

/** Creates an injectable mock for Sunrise Service. */
export function createMockSunriseService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SunriseService,
    useValue: new MockSunriseService(returnValueGenerator),
  };
}
