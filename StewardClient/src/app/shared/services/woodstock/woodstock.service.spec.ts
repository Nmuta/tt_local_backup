import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { WoodstockConsoleIsBannedFakeApi } from '@interceptors/fake-api/apis/title/woodstock/console/isBanned';
import { WoodstockPlayerXuidBanHistoryFakeApi } from '@interceptors/fake-api/apis/title/woodstock/player/xuid/banHistory';
import { WoodstockPlayerXuidConsolesFakeApi } from '@interceptors/fake-api/apis/title/woodstock/player/xuid/consoleDetails';
import { WoodstockPlayerXuidProfileSummaryFakeApi } from '@interceptors/fake-api/apis/title/woodstock/player/xuid/profileSummary';
import { WoodstockPlayerXuidConsoleSharedConsoleUsersFakeApi } from '@interceptors/fake-api/apis/title/woodstock/player/xuid/sharedConsoleUsers';
import { WoodstockPlayerXuidUserFlagsFakeApi } from '@interceptors/fake-api/apis/title/woodstock/player/xuid/userFlags';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { WoodstockUserFlags } from '@models/woodstock';
import { ApiService, createMockApiService } from '@services/api';
import faker from '@faker-js/faker';

import { of } from 'rxjs';

import { WoodstockService } from './woodstock.service';
import { DateTime } from 'luxon';
import { DefaultAuctionFilters } from '@models/auction-filters';
import { HttpParams } from '@angular/common/http';
import { UgcType } from '@models/ugc-filters';
import { PegasusProjectionSlot } from '@models/enums';

describe('WoodstockService', () => {
  let injector: TestBed;
  let service: WoodstockService;
  let apiServiceMock: ApiService;
  let nextReturnValue: unknown = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [createMockApiService(() => nextReturnValue)],
      schemas: [NO_ERRORS_SCHEMA],
    });
    injector = getTestBed();
    service = injector.inject(WoodstockService);
    apiServiceMock = injector.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Method: getPlayerIdentity', () => {
    beforeEach(() => {
      service.getPlayerIdentities$ = jasmine
        .createSpy('getPlayerIdentities')
        .and.returnValue(of([]));
    });

    it('should call service.getPlayerIdentities', done => {
      service.getPlayerIdentity$({ gamertag: 'test' }).subscribe(() => {
        expect(service.getPlayerIdentities$).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('Method: getPlayerIdentities', () => {
    beforeEach(() => {
      nextReturnValue = [];
    });

    it('should call apiServiceMock.postRequest$', done => {
      service.getPlayerIdentities$([]).subscribe(() => {
        expect(apiServiceMock.postRequest$).toHaveBeenCalledWith(
          `${service.basePath}/players/identities`,
          jasmine.any(Object),
        );
        done();
      });
    });
  });

  describe('Method: getLspGroups', () => {
    it('should call API service getRequest$', done => {
      service.getLspGroups$().subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(`${service.basePath}/groups`);
        done();
      });
    });
  });

  describe('Method: getPlayerNotificationsByXuid', () => {
    let expectedXuid;

    beforeEach(() => {
      expectedXuid = new BigNumber(fakeXuid());
    });

    it('should call API service getRequest$ with the expected params', done => {
      service.getPlayerNotifications$(expectedXuid).subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/player/xuid(${expectedXuid})/notifications`,
        );
        done();
      });
    });
  });

  describe('Method: getPlayerInventoryByXuid', () => {
    const xuid = fakeXuid();

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest$').and.returnValue(of([]));
    });

    it('should call apiServiceMock.getRequest$', done => {
      service.getPlayerInventoryByXuid$(xuid).subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/player/xuid(${xuid})/inventory`,
        );
        done();
      });
    });
  });

  describe('Method: getPlayerDetailsByGamertag', () => {
    let expectedGamertag;

    beforeEach(() => {
      expectedGamertag = 'test-gamertag';
    });

    it('should call API service getRequest$ with the expected params', done => {
      service.getPlayerDetailsByGamertag$(expectedGamertag).subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/player/gamertag(${expectedGamertag})/details`,
        );
        done();
      });
    });
  });

  describe('Method: getGiftHistoryByXuid', () => {
    const expectedXuid = new BigNumber(123456789);
    const params = new HttpParams();

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest$').and.returnValue(of([]));
    });

    it('should call API service getRequest$ with the expected params', done => {
      service.getGiftHistoryByXuid$(expectedXuid).subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/player/xuid(${expectedXuid})/giftHistory`,
          params,
        );
        done();
      });
    });
  });

  describe('Method: getProfileRollbacksXuid', () => {
    const expectedXuid = new BigNumber(123456789);

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest$').and.returnValue(of([]));
    });

    it('should call API service getRequest$ with the expected params', done => {
      service.getProfileRollbacksXuid$(expectedXuid).subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/player/xuid(${expectedXuid})/profileRollbacks`,
        );
        done();
      });
    });
  });

  describe('Method: getGiftHistoryByLspGroup', () => {
    const expectedLspGroupId = new BigNumber(1234);
    const params = new HttpParams();

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest$').and.returnValue(of([]));
    });

    it('should call API service getRequest$ with the expected params', done => {
      service.getGiftHistoryByXuid$(expectedLspGroupId).subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/player/xuid(${expectedLspGroupId})/giftHistory`,
          params,
        );
        done();
      });
    });
  });

  it('handles getFlagsByXuid', done => {
    service.getFlagsByXuid$(fakeXuid()).subscribe(output => {
      expect(output as unknown).toEqual(
        nextReturnValue as unknown,
        'fields should not be modified',
      );
      done();
    });
  });

  it('handles putFlagsByXuid', done => {
    const typedReturnValue = (nextReturnValue = WoodstockPlayerXuidUserFlagsFakeApi.make());
    service
      .putFlagsByXuid$(fakeXuid(), typedReturnValue as WoodstockUserFlags)
      .subscribe(output => {
        expect(output as unknown).toEqual(
          nextReturnValue as unknown,
          'fields should not be modified',
        );
        done();
      });
  });

  it('handles getBanHistoryByXuid', done => {
    const typedReturnValue = (nextReturnValue = WoodstockPlayerXuidBanHistoryFakeApi.make(
      new BigNumber(12345),
      1,
    ));
    service.getBanHistoryByXuid$(fakeXuid()).subscribe(output => {
      expect(output[0].startTimeUtc instanceof DateTime).toBe(
        true,
        'liveOps.startTimeUtc is DateTime',
      );
      expect(output[0].expireTimeUtc instanceof DateTime).toBe(
        true,
        'liveOps.expireTimeUtc is DateTime',
      );
      expect(output[0].startTimeUtc instanceof DateTime).toBe(
        true,
        'services.startTimeUtc is DateTime',
      );
      expect(output[0].expireTimeUtc instanceof DateTime).toBe(
        true,
        'services.expireTimeUtc is DateTime',
      );

      // clear the validated fields
      for (const value of [output, typedReturnValue]) {
        value.forEach(v => (v.startTimeUtc = null));
        value.forEach(v => (v.expireTimeUtc = null));
      }

      expect(output as unknown).toEqual(
        nextReturnValue as unknown,
        'other fields should not be modified',
      );

      done();
    });
  });

  it('handles getSharedConsoleUsersByXuid', done => {
    const typedReturnValue = (nextReturnValue =
      WoodstockPlayerXuidConsoleSharedConsoleUsersFakeApi.makeMany());
    service.getSharedConsoleUsersByXuid$(fakeXuid()).subscribe(output => {
      expect(output as unknown).toEqual(
        typedReturnValue as unknown,
        'fields should not be modified',
      );
      done();
    });
  });

  it('handles getConsoleDetailsByXuid', done => {
    nextReturnValue = WoodstockPlayerXuidConsolesFakeApi.makeMany();
    service.getConsoleDetailsByXuid$(new BigNumber(fakeXuid())).subscribe(output => {
      expect(output as unknown).toEqual(
        nextReturnValue as unknown,
        'fields should not be modified',
      );
      done();
    });
  });

  it('handles putBanStatusByConsoleId', done => {
    const sampleGet = WoodstockPlayerXuidConsolesFakeApi.makeMany();
    nextReturnValue = WoodstockConsoleIsBannedFakeApi.make();
    service
      .putBanStatusByConsoleId$(sampleGet[0].consoleId, !sampleGet[0].isBanned)
      .subscribe(output => {
        expect(output as unknown).toEqual(
          nextReturnValue as unknown,
          'fields should not be modified',
        );
        done();
      });
  });

  it('handles getProfileSummaryByXuid', done => {
    const typedReturnValue = WoodstockPlayerXuidProfileSummaryFakeApi.make();
    nextReturnValue = typedReturnValue;
    service.getProfileSummaryByXuid$(fakeXuid()).subscribe(output => {
      expect(output as unknown).toEqual(
        nextReturnValue as unknown,
        'fields should not be modified',
      );
      done();
    });
  });

  describe('Method: getPlayerAuctionsByXuid$', () => {
    const xuid = fakeXuid();
    const filters = DefaultAuctionFilters;

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest').and.returnValue(of([]));
    });

    it('should call apiServiceMock.getRequest', done => {
      service.getPlayerAuctionsByXuid$(xuid, filters).subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/player/xuid(${xuid})/auctions`,
          new HttpParams()
            .append('sort', filters.sort.toString())
            .append('status', filters.status.toString()),
        );
        done();
      });
    });
  });

  describe('Method: getBackstagePassHistoryByXuid', () => {
    const xuid = fakeXuid();

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest$').and.returnValue(of([]));
    });

    it('should call API service getRequest$ with the expected params', done => {
      service.getBackstagePassHistoryByXuid$(xuid).subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/player/xuid(${xuid})/backstagePassUpdates`,
        );
        done();
      });
    });
  });

  describe('Method: getPlayerAccountInventoryByXuid', () => {
    const xuid = fakeXuid();

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest$').and.returnValue(of([]));
    });

    it('should call API service getRequest$ with the expected params', done => {
      service.getPlayerAccountInventoryByXuid$(xuid).subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/player/xuid(${xuid})/accountInventory`,
        );
        done();
      });
    });
  });

  describe('Method: getPlayerUgcByXuid$', () => {
    const xuid = fakeXuid();
    const contentType = UgcType.Livery;
    let httpParams = new HttpParams();

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest').and.returnValue(of([]));
      httpParams = new HttpParams().append('ugcType', contentType);
    });

    it('should call apiServiceMock.getRequest', done => {
      service.getPlayerUgcByXuid$(xuid, contentType).subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/storefront/xuid(${xuid})`,
          httpParams,
        );
        done();
      });
    });
  });

  describe('Method: getPlayerUgcByShareCode$', () => {
    const shareCode = faker.random.word();
    const contentType = UgcType.Livery;
    let httpParams = new HttpParams();

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest').and.returnValue(of([]));
      httpParams = new HttpParams().append('ugcType', contentType);
    });

    it('should call apiServiceMock.getRequest', done => {
      service.getPlayerUgcByShareCode$(shareCode, contentType).subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/storefront/sharecode(${shareCode})`,
          httpParams,
        );
        done();
      });
    });
  });

  describe('Method: getSimpleCars$', () => {
    let httpParams = new HttpParams();

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest').and.returnValue(of([]));
      httpParams = new HttpParams().set('slotId', PegasusProjectionSlot.Live);
    });

    it('should call API service getRequest with the expected params', done => {
      service.getSimpleCars$(PegasusProjectionSlot.Live).subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/items/cars`,
          httpParams,
        );
        done();
      });
    });
  });
});
