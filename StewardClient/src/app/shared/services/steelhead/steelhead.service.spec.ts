import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { SteelheadPlayerXuidConsolesFakeApi } from '@interceptors/fake-api/apis/title/steelhead/player/xuid/consoleDetails';
import { SteelheadPlayerXuidConsoleSharedConsoleUsersFakeApi } from '@interceptors/fake-api/apis/title/steelhead/player/xuid/sharedConsoleUsers';
import { SteelheadPlayerXuidUserFlagsFakeApi } from '@interceptors/fake-api/apis/title/steelhead/player/xuid/userFlags';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { SteelheadGift, SteelheadGroupGift, SteelheadUserFlags } from '@models/steelhead';
import { LspGroup } from '@models/lsp-group';
import { ApiService, createMockApiService } from '@services/api';
import { of } from 'rxjs';
import { SteelheadService } from './steelhead.service';
import { DefaultAuctionFilters } from '@models/auction-filters';
import { HttpParams } from '@angular/common/http';
import { UgcType } from '@models/ugc-filters';
import faker from '@faker-js/faker';

describe('SteelheadService', () => {
  let injector: TestBed;
  let service: SteelheadService;
  let apiServiceMock: ApiService;
  let nextReturnValue: unknown = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [createMockApiService(() => nextReturnValue)],
      schemas: [NO_ERRORS_SCHEMA],
    });
    injector = getTestBed();
    service = injector.inject(SteelheadService);
    apiServiceMock = injector.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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
    const typedReturnValue = (nextReturnValue = SteelheadPlayerXuidUserFlagsFakeApi.make());
    service
      .putFlagsByXuid$(fakeXuid(), typedReturnValue as SteelheadUserFlags)
      .subscribe(output => {
        expect(output as unknown).toEqual(
          nextReturnValue as unknown,
          'fields should not be modified',
        );
        done();
      });
  });

  it('handles getSharedConsoleUsersByXuid$', done => {
    const typedReturnValue = (nextReturnValue =
      SteelheadPlayerXuidConsoleSharedConsoleUsersFakeApi.makeMany());
    service.getSharedConsoleUsersByXuid$(fakeXuid()).subscribe(output => {
      expect(output as unknown).toEqual(
        typedReturnValue as unknown,
        'fields should not be modified',
      );
      done();
    });
  });

  it('handles getConsoleDetailsByXuid$', done => {
    nextReturnValue = SteelheadPlayerXuidConsolesFakeApi.makeMany();
    service.getConsoleDetailsByXuid$(new BigNumber(fakeXuid())).subscribe(output => {
      expect(output as unknown).toEqual(
        nextReturnValue as unknown,
        'fields should not be modified',
      );
      done();
    });
  });

  describe('Method: getPlayerIdentity$', () => {
    beforeEach(() => {
      service.getPlayerIdentities$ = jasmine
        .createSpy('getPlayerIdentities$')
        .and.returnValue(of([]));
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest').and.returnValue(of({}));
    });

    it('should call service.getPlayerIdentities$', done => {
      service.getPlayerIdentity$({ gamertag: 'test' }).subscribe(() => {
        expect(service.getPlayerIdentities$).toHaveBeenCalled();
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

  describe('Method: getPlayerIdentities$', () => {
    beforeEach(() => {
      apiServiceMock.postRequest$ = jasmine.createSpy('postRequest').and.returnValue(of([]));
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

  describe('Method: getPlayerDetailsByGamertag$', () => {
    let expectedGamertag: string;

    beforeEach(() => {
      expectedGamertag = 'test-gamertag';
      nextReturnValue = {};
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

  describe('Method: getLspGroups$', () => {
    it('should call API service getRequest', done => {
      service.getLspGroups$().subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(`${service.basePath}/groups`);
        done();
      });
    });
  });

  describe('Method: getGiftHistoryByXuid$', () => {
    const expectedXuid = new BigNumber(123456789);
    const params = new HttpParams();

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest').and.returnValue(of([]));
    });

    it('should call API service getRequest with the expected params', done => {
      service.getGiftHistoryByXuid$(expectedXuid).subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/player/xuid(${expectedXuid})/giftHistory`,
          params,
        );
        done();
      });
    });
  });

  describe('Method: getGiftHistoryByLspGroup', () => {
    const expectedLspGroupId = new BigNumber(1234);
    const params = new HttpParams();

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest').and.returnValue(of([]));
    });

    it('should call API service getRequest with the expected params', done => {
      service.getGiftHistoryByXuid$(expectedLspGroupId).subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/player/xuid(${expectedLspGroupId})/giftHistory`,
          params,
        );
        done();
      });
    });
  });

  describe('Method: postGiftPlayers$', () => {
    const gift: SteelheadGroupGift = {
      xuids: [new BigNumber(123456789)],
      giftReason: 'unit testing gift',
      inventory: {
        creditRewards: [],
        cars: [],
        vanityItems: [],
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

  describe('Method: postGiftPlayersUsingBackgroundTask$', () => {
    const gift: SteelheadGroupGift = {
      xuids: [new BigNumber(123456789)],
      giftReason: 'unit testing gift',
      inventory: {
        creditRewards: [],
        cars: [],
        vanityItems: [],
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
    const gift: SteelheadGift = {
      giftReason: 'unit testing gift',
      inventory: {
        creditRewards: [],
        cars: [],
        vanityItems: [],
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
});
