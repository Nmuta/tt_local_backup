import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { SunriseConsoleIsBannedFakeApi } from '@interceptors/fake-api/apis/title/sunrise/console/isBanned';
import { SunrisePlayerXuidBanHistoryFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/banHistory';
import { SunrisePlayerXuidConsolesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/consoleDetails';
import { SunrisePlayerXuidProfileSummaryFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/profileSummary';
import { SunrisePlayerXuidConsoleSharedConsoleUsersFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/sharedConsoleUsers';
import { SunrisePlayerXuidUserFlagsFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/userFlags';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { LspGroup } from '@models/lsp-group';
import { SunriseGift, SunriseGroupGift, SunriseUserFlags } from '@models/sunrise';
import { ApiService, createMockApiService } from '@services/api';

import { of } from 'rxjs';

import { SunriseService } from './sunrise.service';

describe('SunriseService', () => {
  let injector: TestBed;
  let service: SunriseService;
  let apiServiceMock: ApiService;
  let nextReturnValue: unknown = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [createMockApiService(() => nextReturnValue)],
      schemas: [NO_ERRORS_SCHEMA],
    });
    injector = getTestBed();
    service = injector.inject(SunriseService);
    apiServiceMock = injector.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Method: getPlayerIdentity$', () => {
    beforeEach(() => {
      service.getPlayerIdentities$ = jasmine
        .createSpy('getPlayerIdentities$')
        .and.returnValue(of([]));
    });

    it('should call service.getPlayerIdentities$', done => {
      service.getPlayerIdentity$({ gamertag: 'test' }).subscribe(() => {
        expect(service.getPlayerIdentities$).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('Method: getPlayerIdentities$', () => {
    beforeEach(() => {
      nextReturnValue = [];
    });

    it('should call apiServiceMock.postRequest', done => {
      service.getPlayerIdentities$([]).subscribe(() => {
        expect(apiServiceMock.postRequest$).toHaveBeenCalledWith(
          `${service.basePath}/players/identities`,
          jasmine.any(Object),
        );
        done();
      });
    });
  });

  describe('Method: getLspGroups$', () => {
    it('should call API service getRequest', done => {
      service.getLspGroups$().subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(`${service.basePath}/groups`);
        done();
      });
    });
  });

  describe('Method: getPlayerNotificationsByXuid$', () => {
    let expectedXuid;

    beforeEach(() => {
      expectedXuid = new BigNumber(fakeXuid());
    });

    it('should call API service getRequest with the expected params', done => {
      service.getPlayerNotificationsByXuid$(expectedXuid).subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/player/xuid(${expectedXuid})/notifications`,
        );
        done();
      });
    });
  });

  describe('Method: getPlayerInventoryByXuid$', () => {
    const xuid = fakeXuid();

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest').and.returnValue(of([]));
    });

    it('should call apiServiceMock.getRequest', done => {
      service.getPlayerInventoryByXuid$(xuid).subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/player/xuid(${xuid})/inventory`,
        );
        done();
      });
    });
  });

  describe('Method: getPlayerDetailsByGamertag$', () => {
    let expectedGamertag;

    beforeEach(() => {
      expectedGamertag = 'test-gamertag';
    });

    it('should call API service getRequest with the expected params', done => {
      service.getPlayerDetailsByGamertag$(expectedGamertag).subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/player/gamertag(${expectedGamertag})/details`,
        );
        done();
      });
    });
  });

  describe('Method: getGiftHistoryByXuid$', () => {
    const expectedXuid = new BigNumber(123456789);

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest').and.returnValue(of([]));
    });

    it('should call API service getRequest with the expected params', done => {
      service.getGiftHistoryByXuid$(expectedXuid).subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/player/xuid(${expectedXuid})/giftHistory`,
        );
        done();
      });
    });
  });

  describe('Method: getProfileRollbacksXuid$', () => {
    const expectedXuid = new BigNumber(123456789);

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest').and.returnValue(of([]));
    });

    it('should call API service getRequest with the expected params', done => {
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

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest').and.returnValue(of([]));
    });

    it('should call API service getRequest with the expected params', done => {
      service.getGiftHistoryByXuid$(expectedLspGroupId).subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/player/xuid(${expectedLspGroupId})/giftHistory`,
        );
        done();
      });
    });
  });

  it('handles getFlagsByXuid$', done => {
    service.getFlagsByXuid$(fakeXuid()).subscribe(output => {
      expect(output as unknown).toEqual(
        nextReturnValue as unknown,
        'fields should not be modified',
      );
      done();
    });
  });

  it('handles putFlagsByXuid$', done => {
    const typedReturnValue = (nextReturnValue = SunrisePlayerXuidUserFlagsFakeApi.make());
    service.putFlagsByXuid$(fakeXuid(), typedReturnValue as SunriseUserFlags).subscribe(output => {
      expect(output as unknown).toEqual(
        nextReturnValue as unknown,
        'fields should not be modified',
      );
      done();
    });
  });

  it('handles getBanHistoryByXuid$', done => {
    const typedReturnValue = (nextReturnValue = SunrisePlayerXuidBanHistoryFakeApi.make(
      new BigNumber(12345),
      1,
    ));
    service.getBanHistoryByXuid$(fakeXuid()).subscribe(output => {
      expect(output[0].startTimeUtc instanceof Date).toBe(true, 'liveOps.startTimeUtc is Date');
      expect(output[0].expireTimeUtc instanceof Date).toBe(true, 'liveOps.expireTimeUtc is Date');
      expect(output[0].startTimeUtc instanceof Date).toBe(true, 'services.startTimeUtc is Date');
      expect(output[0].expireTimeUtc instanceof Date).toBe(true, 'services.expireTimeUtc is Date');

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

  it('handles getSharedConsoleUsersByXuid$', done => {
    const typedReturnValue = (nextReturnValue = SunrisePlayerXuidConsoleSharedConsoleUsersFakeApi.makeMany());
    service.getSharedConsoleUsersByXuid$(fakeXuid()).subscribe(output => {
      expect(output as unknown).toEqual(
        typedReturnValue as unknown,
        'fields should not be modified',
      );
      done();
    });
  });

  it('handles getConsoleDetailsByXuid$', done => {
    nextReturnValue = SunrisePlayerXuidConsolesFakeApi.makeMany();
    service.getConsoleDetailsByXuid$(new BigNumber(fakeXuid())).subscribe(output => {
      expect(output as unknown).toEqual(
        nextReturnValue as unknown,
        'fields should not be modified',
      );
      done();
    });
  });

  it('handles putBanStatusByConsoleId$', done => {
    const sampleGet = SunrisePlayerXuidConsolesFakeApi.makeMany();
    nextReturnValue = SunriseConsoleIsBannedFakeApi.make();
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

  it('handles getProfileSummaryByXuid$', done => {
    const typedReturnValue = SunrisePlayerXuidProfileSummaryFakeApi.make();
    nextReturnValue = typedReturnValue;
    service.getProfileSummaryByXuid$(fakeXuid()).subscribe(output => {
      expect(output as unknown).toEqual(
        nextReturnValue as unknown,
        'fields should not be modified',
      );
      done();
    });
  });

  describe('Method: postGiftPlayers$', () => {
    const gift: SunriseGroupGift = {
      xuids: [new BigNumber(123456789)],
      giftReason: 'unit testing gift',
      inventory: {
        creditRewards: [],
        cars: [],
        vanityItems: [],
        carHorns: [],
        quickChatLines: [],
        emotes: [],
      },
    };

    beforeEach(() => {
      apiServiceMock.postRequest$ = jasmine.createSpy('postRequest').and.returnValue(of([]));
    });

    it('should call API service postRequest with the expected params', done => {
      service.postGiftPlayers$(gift).subscribe(() => {
        expect(apiServiceMock.postRequest$).toHaveBeenCalledWith(
          `${service.basePath}/gifting/players`,
          gift,
        );
        done();
      });
    });
  });

  describe('Method: postGiftPlayers$UsingBackgroundTask$', () => {
    const gift: SunriseGroupGift = {
      xuids: [new BigNumber(123456789)],
      giftReason: 'unit testing gift',
      inventory: {
        creditRewards: [],
        cars: [],
        vanityItems: [],
        carHorns: [],
        quickChatLines: [],
        emotes: [],
      },
    };

    beforeEach(() => {
      apiServiceMock.postRequest$ = jasmine.createSpy('postRequest').and.returnValue(of([]));
    });

    it('should call API service postRequest with the expected params', done => {
      service.postGiftPlayersUsingBackgroundTask$(gift).subscribe(() => {
        expect(apiServiceMock.postRequest$).toHaveBeenCalledWith(
          `${service.basePath}/gifting/players/useBackgroundProcessing`,
          gift,
        );
        done();
      });
    });
  });

  describe('Method: postGiftLspGroup$', () => {
    const lspGroup: LspGroup = { id: new BigNumber(123), name: 'test-lsp-group' };
    const gift: SunriseGift = {
      giftReason: 'unit testing gift',
      inventory: {
        creditRewards: [],
        cars: [],
        vanityItems: [],
        carHorns: [],
        quickChatLines: [],
        emotes: [],
      },
    };

    beforeEach(() => {
      apiServiceMock.postRequest$ = jasmine.createSpy('postRequest').and.returnValue(of([]));
    });

    it('should call API service postRequest with the expected params', done => {
      service.postGiftLspGroup$(lspGroup, gift).subscribe(() => {
        expect(apiServiceMock.postRequest$).toHaveBeenCalledWith(
          `${service.basePath}/gifting/groupId(${lspGroup.id})`,
          gift,
        );
        done();
      });
    });
  });
});
