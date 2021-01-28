import { Injectable, Provider } from '@angular/core';
import { SunrisePlayerXuidBanHistoryFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/banHistory';
import { SunrisePlayersBanFakeApi } from '@interceptors/fake-api/apis/title/sunrise/players/ban';
import { SunrisePlayersBanSummariesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/players/ban-summaries';
import { SunriseBanHistory } from '@models/sunrise';
import _ from 'lodash';
import { defer, of } from 'rxjs';

import { SunriseService } from './sunrise.service';

/** Defines the mock for the API Service. */
@Injectable()
export class MockSunriseService {
  public getIdentity = jasmine
    .createSpy('getIdentity')
    .and.returnValue(of({ xuid: BigInt(12345), gamertag: 'gamertag' }));

  public getPlayerDetailsByGamertag = jasmine
    .createSpy('getPlayerDetailsByGamertag')
    .and.returnValue(defer(() => of(_.clone(this.generator()))));
  public getFlagsByXuid = jasmine
    .createSpy('getFlagsByXuid')
    .and.returnValue(defer(() => of(_.clone(this.generator()))));
  public putFlagsByXuid = jasmine
    .createSpy('putFlagsByXuid')
    .and.returnValue(defer(() => of(_.clone(this.generator()))));
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
    .and.returnValue(defer(() => of(_.clone(this.generator()))));
  public getConsoleDetailsByXuid = jasmine
    .createSpy('getConsoleDetailsByXuid')
    .and.returnValue(defer(() => of(_.clone(this.generator()))));
  public putBanStatusByConsoleId = jasmine
    .createSpy('putBanStatusByConsoleId')
    .and.returnValue(defer(() => of(_.clone(this.generator()))));
  public getProfileSummaryByXuid = jasmine
    .createSpy('getProfileSummaryByXuid')
    .and.returnValue(defer(() => of(_.clone(this.generator()))));
  public getCreditHistoryByXuid = jasmine
    .createSpy('getCreditHistoryByXuid')
    .and.returnValue(defer(() => of(_.clone(this.generator()))));
  public getPlayerNotificationsByXuid = jasmine
    .createSpy('getPlayerNotificationsByXuid')
    .and.returnValue(defer(() => of(_.clone(this.generator()))));
  public postBanPlayers = jasmine
    .createSpy('postBanPlayers')
    .and.returnValue(defer(() => SunrisePlayersBanFakeApi.make()));
  public getBanSummariesByXuids = jasmine
    .createSpy('getBanSummariesByXuids')
    .and.callFake((xuids: BigInt[]) => defer(() => of(SunrisePlayersBanSummariesFakeApi.make(xuids))));

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
