import { Injectable, Provider } from '@angular/core';
import { of } from 'rxjs';

import { SunriseService } from './sunrise.service';

/** Defines the mock for the API Service. */
@Injectable()
export class MockSunriseService {
  public getPlayerDetailsByGamertag = jasmine
    .createSpy('getPlayerDetailsByGamertag')
    .and.returnValue(of({}));
  public getFlagsByXuid = jasmine
    .createSpy('getFlagsByXuid')
    .and.returnValue(of());
  public putFlagsByXuid = jasmine
    .createSpy('putFlagsByXuid')
    .and.returnValue(of());
  public getBanHistoryByXuid = jasmine
    .createSpy('getBanHistoryByXuid')
    .and.returnValue(of());
  public getSharedConsoleUsersByXuid = jasmine
    .createSpy('getSharedConsoleUsersByXuid')
    .and.returnValue(of());
  public getConsoleDetailsByXuid = jasmine
    .createSpy('getConsoleDetailsByXuid')
    .and.returnValue(of());
  public putBanStatusByConsoleId = jasmine
    .createSpy('putBanStatusByConsoleId')
    .and.returnValue(of());
  public getProfileSummaryByXuid = jasmine
    .createSpy('getProfileSummaryByXuid')
    .and.returnValue(of());
  public getCreditHistoryByXuid = jasmine
    .createSpy('getCreditHistoryByXuid')
    .and.returnValue(of());
}

export function createMockSunriseService(): Provider {
  return {
    provide: SunriseService,
    useValue: new MockSunriseService(),
  };
}
