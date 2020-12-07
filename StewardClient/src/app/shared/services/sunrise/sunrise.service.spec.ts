import { getTestBed, TestBed } from '@angular/core/testing';
import { SunriseConsoleIsBannedFakeApi } from '@interceptors/fake-api/apis/title/sunrise/console/isBanned';
import { SunrisePlayerXuidBanHistoryFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/banHistory';
import { SunrisePlayerXuidConsolesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/consoleDetails';
import { SunrisePlayerXuidProfileSummaryFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/profileSummary';
import { SunrisePlayerXuidConsoleSharedConsoleUsersFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/sharedConsoleUsers';
import { SunrisePlayerXuidUserFlagsFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/userFlags';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { SunriseUserFlags } from '@models/sunrise';
import { Unprocessed } from '@models/unprocessed';
import { ApiService, createMockApiService } from '@services/api';

import { of } from 'rxjs';

import { SunriseService } from './sunrise.service';

describe('SunriseService', () => {
  let injector: TestBed;
  let service: SunriseService;
  let apiServiceMock: ApiService;
  let nextReturnValue: Unprocessed<unknown> = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [createMockApiService(() => nextReturnValue)],
    });
    injector = getTestBed();
    service = injector.inject(SunriseService);
    apiServiceMock = injector.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Method: getPlayerDetailsByGamertag', () => {
    let expectedGamertag;

    beforeEach(() => {
      expectedGamertag = 'test-gamertag';
      apiServiceMock.getRequest = jasmine.createSpy('getRequest').and.returnValue(of({}));
    });

    it('should call API service getRequest with the expected params', done => {
      service.getPlayerDetailsByGamertag(expectedGamertag).subscribe(() => {
        expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
          `${service.basePath}/player/gamertag(${expectedGamertag})/details`,
        );
        done();
      });
    });
  });

  it('handles getFlagsByXuid', done => {
    service.getFlagsByXuid(fakeXuid()).subscribe(output => {
      expect(output as unknown).toEqual(
        nextReturnValue as unknown,
        'fields should not be modified',
      );
      done();
    });
  });

  it('handles putFlagsByXuid', done => {
    const typedReturnValue = (nextReturnValue = SunrisePlayerXuidUserFlagsFakeApi.make());
    service.putFlagsByXuid(fakeXuid(), typedReturnValue as SunriseUserFlags).subscribe(output => {
      expect(output as unknown).toEqual(
        nextReturnValue as unknown,
        'fields should not be modified',
      );
      done();
    });
  });

  it('handles getBanHistoryByXuid', done => {
    const typedReturnValue = (nextReturnValue = SunrisePlayerXuidBanHistoryFakeApi.make());
    service.getBanHistoryByXuid(fakeXuid()).subscribe(output => {
      expect(output.liveOpsBanHistory[0].startTimeUtc instanceof Date).toBe(
        true,
        'liveOps.startTimeUtc is Date',
      );
      expect(output.liveOpsBanHistory[0].expireTimeUtc instanceof Date).toBe(
        true,
        'liveOps.expireTimeUtc is Date',
      );
      expect(output.servicesBanHistory[0].startTimeUtc instanceof Date).toBe(
        true,
        'services.startTimeUtc is Date',
      );
      expect(output.servicesBanHistory[0].expireTimeUtc instanceof Date).toBe(
        true,
        'services.expireTimeUtc is Date',
      );

      // clear the validated fields
      for (const value of [output, typedReturnValue]) {
        for (const history of [value.liveOpsBanHistory, value.servicesBanHistory]) {
          history.forEach(v => (v.startTimeUtc = null));
          history.forEach(v => (v.expireTimeUtc = null));
        }
      }

      expect(output as unknown).toEqual(
        nextReturnValue as unknown,
        'other fields should not be modified',
      );

      done();
    });
  });

  it('handles getSharedConsoleUsersByXuid', done => {
    const typedReturnValue = (nextReturnValue = SunrisePlayerXuidConsoleSharedConsoleUsersFakeApi.makeMany());
    service.getSharedConsoleUsersByXuid(fakeXuid()).subscribe(output => {
      expect(output as unknown).toEqual(
        typedReturnValue as unknown,
        'fields should not be modified',
      );
      done();
    });
  });

  it('handles getConsoleDetailsByXuid', done => {
    nextReturnValue = SunrisePlayerXuidConsolesFakeApi.makeMany();
    service.getConsoleDetailsByXuid(fakeXuid()).subscribe(output => {
      expect(output as unknown).toEqual(
        nextReturnValue as unknown,
        'fields should not be modified',
      );
      done();
    });
  });

  it('handles putBanStatusByConsoleId', done => {
    const sampleGet = SunrisePlayerXuidConsolesFakeApi.makeMany();
    nextReturnValue = SunriseConsoleIsBannedFakeApi.make();
    service
      .putBanStatusByConsoleId(sampleGet[0].consoleId, !sampleGet[0].isBanned)
      .subscribe(output => {
        expect(output as unknown).toEqual(
          nextReturnValue as unknown,
          'fields should not be modified',
        );
        done();
      });
  });

  it('handles getProfileSummaryByXuid', done => {
    const typedReturnValue = SunrisePlayerXuidProfileSummaryFakeApi.make();
    nextReturnValue = typedReturnValue;
    service.getProfileSummaryByXuid(fakeXuid()).subscribe(output => {
      expect(output as unknown).toEqual(
        nextReturnValue as unknown,
        'fields should not be modified',
      );
      done();
    });
  });
});