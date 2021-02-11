import { Injectable, Provider } from '@angular/core';
import { SunrisePlayerXuidBanHistoryFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/banHistory';
import { SunrisePlayerXuidInventoryFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/inventory';
import { SunrisePlayersBanFakeApi } from '@interceptors/fake-api/apis/title/sunrise/players/ban';
import { SunrisePlayersBanSummariesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/players/ban-summaries';
import { SunrisePlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/players/identities';
import { IdentityQueryAlpha, IdentityQueryAlphaBatch } from '@models/identity-query.model';
import { SunriseBanHistory } from '@models/sunrise';
import _ from 'lodash';
import { defer, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { SunriseService } from './sunrise.service';

/** Defines the mock for the API Service. */
@Injectable()
export class MockSunriseService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$ = of();

  public getIdentity = jasmine
    .createSpy('getIdentity')
    .and.returnValue(
      defer(() =>
        this.waitUntil$.pipe(switchMap(() => of({ xuid: BigInt(12345), gamertag: 'gamertag' }))),
      ),
    );

  public getPlayerDetailsByGamertag = jasmine
    .createSpy('getPlayerDetailsByGamertag')
    .and.returnValue(
      defer(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator()))))),
    );
  public getFlagsByXuid = jasmine
    .createSpy('getFlagsByXuid')
    .and.returnValue(
      defer(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator()))))),
    );
  public putFlagsByXuid = jasmine
    .createSpy('putFlagsByXuid')
    .and.returnValue(
      defer(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator()))))),
    );
  public getBanHistoryByXuid = jasmine.createSpy('getBanHistoryByXuid').and.returnValue(
    defer(() => {
      const unprocessed = (SunrisePlayerXuidBanHistoryFakeApi.make(
        BigInt(12345),
      ) as unknown) as SunriseBanHistory;

      for (const entry of unprocessed.liveOpsBanHistory) {
        entry.startTimeUtc = new Date(entry.startTimeUtc);
        entry.expireTimeUtc = new Date(entry.expireTimeUtc);
      }

      return of(unprocessed.liveOpsBanHistory);
    }),
  );
  public getSharedConsoleUsersByXuid = jasmine
    .createSpy('getSharedConsoleUsersByXuid')
    .and.returnValue(
      defer(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator()))))),
    );
  public getConsoleDetailsByXuid = jasmine
    .createSpy('getConsoleDetailsByXuid')
    .and.returnValue(
      defer(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator()))))),
    );
  public putBanStatusByConsoleId = jasmine
    .createSpy('putBanStatusByConsoleId')
    .and.returnValue(
      defer(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator()))))),
    );
  public getProfileSummaryByXuid = jasmine
    .createSpy('getProfileSummaryByXuid')
    .and.returnValue(
      defer(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator()))))),
    );
  public getCreditHistoryByXuid = jasmine
    .createSpy('getCreditHistoryByXuid')
    .and.returnValue(
      defer(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator()))))),
    );
  public getPlayerNotificationsByXuid = jasmine
    .createSpy('getPlayerNotificationsByXuid')
    .and.returnValue(
      defer(() => this.waitUntil$.pipe(switchMap(() => of(_.clone(this.generator()))))),
    );
  public postBanPlayers = jasmine
    .createSpy('postBanPlayers')
    .and.returnValue(
      defer(() => this.waitUntil$.pipe(switchMap(() => of(SunrisePlayersBanFakeApi.make())))),
    );
  public getBanSummariesByXuids = jasmine
    .createSpy('getBanSummariesByXuids')
    .and.callFake((xuids: BigInt[]) =>
      defer(() =>
        this.waitUntil$.pipe(switchMap(() => of(SunrisePlayersBanSummariesFakeApi.make(xuids)))),
      ),
    );
  public getMasterInventory = jasmine.createSpy('getMasterInventory').and.returnValue(of({}));

  public getPlayerIdentity = jasmine
    .createSpy('getPlayerIdentity')
    .and.callFake((query: IdentityQueryAlpha) =>
      defer(() =>
        this.waitUntil$.pipe(switchMap(() => of(SunrisePlayersIdentitiesFakeApi.make([query])))),
      ),
    );
  public getPlayerIdentities = jasmine
    .createSpy('getPlayerIdentities')
    .and.callFake((query: IdentityQueryAlphaBatch) =>
      defer(() =>
        this.waitUntil$.pipe(switchMap(() => of(SunrisePlayersIdentitiesFakeApi.make(query)))),
      ),
    );

  public getPlayerInventoryByXuid = jasmine
    .createSpy('getPlayerInventoryByXuid')
    .and.callFake(xuid =>
      defer(() =>
        this.waitUntil$.pipe(switchMap(() => of(SunrisePlayerXuidInventoryFakeApi.make(xuid)))),
      ),
    );

  constructor(private readonly generator: () => unknown) {}
}

/** Creates an injectable mock for Sunrise Service. */
export function createMockSunriseService(
  returnValueGenerator: () => unknown = () => new Object(),
): Provider {
  return {
    provide: SunriseService,
    useValue: new MockSunriseService(returnValueGenerator),
  };
}
