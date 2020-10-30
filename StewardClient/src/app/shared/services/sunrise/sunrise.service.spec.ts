import { getTestBed, TestBed } from '@angular/core/testing';
import { SunriseConsoleIsBannedFakeApi } from '@interceptors/fake-api/apis/title/sunrise/console/isBanned';
import { SunrisePlayerGamertagDetailsFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/gamertag/details';
import { SunrisePlayerXuidBanHistoryFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/banHistory';
import { SunrisePlayerXuidConsolesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/consoleDetails';
import { SunrisePlayerXuidConsoleSharedConsoleUsersFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/sharedConsoleUsers';
import { SunrisePlayerXuidUserFlagsFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/userFlags';
import { ApiService, createMockApiService } from '@services/api';

import { SunriseService } from './sunrise.service';

describe('SunriseService', () => {
  let injector: TestBed;
  let service: SunriseService;
  let apiServiceMock: ApiService;
  let nextReturnValue: any = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [createMockApiService(() => { debugger; return nextReturnValue; })],
    });
    injector = getTestBed();
    service = injector.inject(SunriseService);
    apiServiceMock = injector.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('handles getPlayerDetailsByGamertag', (done) => {
    nextReturnValue = SunrisePlayerGamertagDetailsFakeApi.make();
    service.getPlayerDetailsByGamertag(nextReturnValue.gamertag)
      .subscribe(output => {
        expect(output).toEqual(nextReturnValue, 'fields should not be modified');
        done();
      });
  });

  it('handles getFlagsByXuid', (done) => {
    nextReturnValue = SunrisePlayerXuidUserFlagsFakeApi.make();
    service.getFlagsByXuid(nextReturnValue.gamertag)
      .subscribe(output => {
        expect(output).toEqual(nextReturnValue, 'fields should not be modified');
        done();
      });
  });

  it('handles putFlagsByXuid', (done) => {
    nextReturnValue = SunrisePlayerXuidUserFlagsFakeApi.make();
    service.putFlagsByXuid(nextReturnValue.gamertag, nextReturnValue as any)
      .subscribe(output => {
        expect(output).toEqual(nextReturnValue, 'fields should not be modified');
        done();
      });
  });

  it('handles getBanHistoryByXuid', (done) => {
    nextReturnValue = SunrisePlayerXuidBanHistoryFakeApi.make();
    service.getBanHistoryByXuid(nextReturnValue.gamertag)
      .subscribe(output => {
        expect(output.liveOpsBanHistory[0].startTimeUtc instanceof Date).toBe(true, 'liveOps.startTimeUtc is Date');
        expect(output.liveOpsBanHistory[0].expireTimeUtc instanceof Date).toBe(true, 'liveOps.expireTimeUtc is Date');
        expect(output.servicesBanHistory[0].startTimeUtc instanceof Date).toBe(true, 'services.startTimeUtc is Date');
        expect(output.servicesBanHistory[0].expireTimeUtc instanceof Date).toBe(true, 'services.expireTimeUtc is Date');

        // clear the validated fields
        for (let value of [output, nextReturnValue]) {
          for (let history of [value.liveOpsBanHistory, value.servicesBanHistory]) {
            history.forEach(v => v.startTimeUtc = null);
            history.forEach(v => v.expireTimeUtc = null);
          }
        }

        expect(output).toEqual(nextReturnValue, 'other fields should not be modified');

        done();
      });
  });

  it('handles getSharedConsoleUsersByXuid', (done) => {
    nextReturnValue = SunrisePlayerXuidConsoleSharedConsoleUsersFakeApi.makeMany();
    service.getSharedConsoleUsersByXuid(nextReturnValue.gamertag)
      .subscribe(output => {
        expect(output).toEqual(nextReturnValue, 'fields should not be modified');
        done();
      });
  });

  it('handles getConsoleDetailsByXuid', (done) => {
    nextReturnValue = SunrisePlayerXuidConsolesFakeApi.makeMany();
    service.getConsoleDetailsByXuid(nextReturnValue.gamertag)
      .subscribe(output => {
        expect(output).toEqual(nextReturnValue, 'fields should not be modified');
        done();
      });
  });

  it('handles putBanStatusByConsoleId', (done) => {
    nextReturnValue = SunriseConsoleIsBannedFakeApi.makeMany();
    service.putBanStatusByConsoleId(nextReturnValue.gamertag, nextReturnValue)
      .subscribe(output => {
        expect(output).toEqual(nextReturnValue, 'fields should not be modified');
        done();
      });
  });
});
