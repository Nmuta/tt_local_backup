import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { SunriseConsoleIsBannedFakeApi } from '@interceptors/fake-api/apis/title/sunrise/console/isBanned';
import { SunrisePlayerXuidBanHistoryFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/banHistory';
import { SunrisePlayerXuidConsolesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/consoleDetails';
import { SunrisePlayerXuidProfileSummaryFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/profileSummary';
import { SunrisePlayerXuidConsoleSharedConsoleUsersFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/sharedConsoleUsers';
import { SunrisePlayerXuidUserFlagsFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/userFlags';
import { fakeBigNumber, fakeXuid } from '@interceptors/fake-api/utility';
import { LspGroup } from '@models/lsp-group';
import { SunriseGift, SunriseGroupGift, SunriseUserFlags } from '@models/sunrise';
import { ApiService, createMockApiService } from '@services/api';
import { of } from 'rxjs';
import { SunriseService } from './sunrise.service';
import { DefaultAuctionFilters } from '@models/auction-filters';
import { HttpParams } from '@angular/common/http';
import { DateTime } from 'luxon';
import { UGCType } from '@models/ugc-filters';
import faker from 'faker';
import { Gift, GroupGift } from '@models/gift';
import { SunriseAuctionBlocklistFakeApi } from '@interceptors/fake-api/apis/title/sunrise/auctionBlocklist';

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

  describe('Method: getMasterInventory$', () => {
    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest').and.returnValue(of([]));
    });

    it('should call API service getRequest with the expected params', done => {
      service.getMasterInventory$().subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/masterInventory`,
        );
        done();
      });
    });
  });

  describe('Method: getDetailedCars$', () => {
    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest').and.returnValue(of([]));
    });

    it('should call API service getRequest with the expected params', done => {
      service.getDetailedCars$().subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(`${service.basePath}/kusto/cars`);
        done();
      });
    });
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
        expect(apiServiceMock.postRequest$).toHaveBeenCalled();
        expect((apiServiceMock.postRequest$ as jasmine.Spy).calls.mostRecent().args[0]).toBe(
          `${service.basePath}/players/identities`,
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
      service.getPlayerNotifications$(expectedXuid).subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/player/xuid(${expectedXuid})/notifications`,
        );
        done();
      });
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

  describe('Method: getProfileNotesXuid$', () => {
    const expectedXuid = new BigNumber(123456789);

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest$').and.returnValue(of([]));
    });

    it('should call API service getRequest with the expected params', done => {
      service.getProfileNotesXuid$(expectedXuid).subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/player/xuid(${expectedXuid})/profileNotes`,
        );
        done();
      });
    });
  });

  describe('Method: getGiftHistoryByLspGroup', () => {
    const expectedLspGroupId = new BigNumber(1234);

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest$').and.returnValue(of([]));
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

  it('handles getSharedConsoleUsersByXuid$', done => {
    const typedReturnValue = (nextReturnValue =
      SunrisePlayerXuidConsoleSharedConsoleUsersFakeApi.makeMany());
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

  describe('Method: getCreditHistoryByXuid', () => {
    const xuid = fakeXuid();
    const startIndex = 0;
    const maxResults = faker.datatype.number(5_000);

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest$').and.returnValue(of([]));
    });

    it('should call API service getRequest$ with the expected params', done => {
      const httpParams = new HttpParams()
        .set('startIndex', startIndex.toString())
        .set('maxResults', maxResults.toString());

      service.getCreditHistoryByXuid$(xuid, startIndex, maxResults).subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/player/xuid(${xuid})/creditUpdates`,
          httpParams,
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

  describe('Method: getPlayerUGCByXuid$', () => {
    const xuid = fakeXuid();
    const contentType = UGCType.Livery;
    let httpParams = new HttpParams();

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest').and.returnValue(of([]));
      httpParams = new HttpParams().append('ugcType', contentType);
    });

    it('should call apiServiceMock.getRequest', done => {
      service.getPlayerUGCByXuid$(xuid, contentType).subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/storefront/xuid(${xuid})`,
          httpParams,
        );
        done();
      });
    });
  });

  describe('Method: getPlayerUGCByShareCode$', () => {
    const shareCode = faker.random.word();
    const contentType = UGCType.Livery;
    let httpParams = new HttpParams();

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest').and.returnValue(of([]));
      httpParams = new HttpParams().append('ugcType', contentType);
    });

    it('should call apiServiceMock.getRequest', done => {
      service.getPlayerUGCByShareCode$(shareCode, contentType).subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/storefront/sharecode(${shareCode})`,
          httpParams,
        );
        done();
      });
    });
  });

  describe('Method: postGiftLiveryToPlayersUsingBackgroundJob$', () => {
    const liveryId = faker.datatype.uuid();
    const groupGift: GroupGift = {
      xuids: [fakeBigNumber(), fakeBigNumber(), fakeBigNumber()],
      giftReason: faker.random.words(10),
    };

    beforeEach(() => {
      apiServiceMock.postRequest$ = jasmine.createSpy('postRequest$').and.returnValue(of([]));
    });

    it('should call apiServiceMock.postRequest', done => {
      service.postGiftLiveryToPlayersUsingBackgroundJob$(liveryId, groupGift).subscribe(() => {
        expect(apiServiceMock.postRequest$).toHaveBeenCalledWith(
          `${service.basePath}/gifting/livery(${liveryId})/players/useBackgroundProcessing`,
          groupGift,
        );
        done();
      });
    });
  });

  describe('Method: getAuctionBlocklist', () => {
    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest$').and.returnValue(of([]));
    });

    it('should call API service getRequest$ with the expected params', done => {
      service.getAuctionBlocklist$().subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/auctions/blockList`,
        );
        done();
      });
    });
  });

  describe('Method: postAuctionBlocklistEntries', () => {
    const entries = SunriseAuctionBlocklistFakeApi.make();

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest$').and.returnValue(of([]));
    });

    it('should call API service getRequest$ with the expected params', done => {
      service.postAuctionBlocklistEntries$(entries).subscribe(() => {
        expect(apiServiceMock.postRequest$).toHaveBeenCalledWith(
          `${service.basePath}/auctions/blockList`,
          entries,
        );
        done();
      });
    });
  });

  describe('Method: postGiftLiveryToLspGroup$', () => {
    const liveryId = faker.datatype.uuid();
    const lspGroup: LspGroup = { id: fakeBigNumber(), name: faker.random.words(2) };
    const gift: Gift = {
      giftReason: faker.random.words(10),
    };

    beforeEach(() => {
      apiServiceMock.postRequest$ = jasmine.createSpy('postRequest$').and.returnValue(of([]));
    });

    it('should call apiServiceMock.postRequest', done => {
      service.postGiftLiveryToLspGroup$(liveryId, lspGroup, gift).subscribe(() => {
        expect(apiServiceMock.postRequest$).toHaveBeenCalledWith(
          `${service.basePath}/gifting/livery(${liveryId})/groupId(${lspGroup.id})`,
          gift,
        );
        done();
      });
    });
  });

  describe('Method: deleteAuctionBlocklistEntry', () => {
    const carId: BigNumber = new BigNumber(0);

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest$').and.returnValue(of([]));
    });

    it('should call API service getRequest$ with the expected params', done => {
      service.deleteAuctionBlocklistEntry$(carId).subscribe(() => {
        expect(apiServiceMock.deleteRequest$).toHaveBeenCalledWith(
          `${service.basePath}/auctions/blockList/carId(${carId})`,
        );
        done();
      });
    });
  });

  describe('Method: hideUgc', () => {
    const ugcId = faker.datatype.uuid();

    beforeEach(() => {
      apiServiceMock.postRequest$ = jasmine.createSpy('postRequest$').and.returnValue(of([]));
    });

    it('should call API service postRequest$ with the expected params', done => {
      service.hideUgc$(ugcId).subscribe(() => {
        expect(apiServiceMock.postRequest$).toHaveBeenCalledWith(
          `${service.basePath}/storefront/ugc/${ugcId}/hide`,
          null,
        );
        done();
      });
    });
  });

  describe('Method: unhideUgc', () => {
    const xuid = new BigNumber(0);
    const ugcId = faker.datatype.uuid();
    const fileType = 'Livery';

    beforeEach(() => {
      apiServiceMock.postRequest$ = jasmine.createSpy('postRequest$').and.returnValue(of([]));
    });

    it('should call API service postRequest$ with the expected params', done => {
      service.unhideUgc$(xuid, fileType, ugcId).subscribe(() => {
        expect(apiServiceMock.postRequest$).toHaveBeenCalledWith(
          `${service.basePath}/storefront/${xuid}/ugc/${fileType}/${ugcId}/unhide`,
          null,
        );
        done();
      });
    });
  });
});
