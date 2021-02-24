import { HttpParams } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { ApolloGift, ApolloGroupGift } from '@models/apollo';
import { LspGroup } from '@models/lsp-group';
import { Unprocessed } from '@models/unprocessed';
import { ApiService, createMockApiService } from '@services/api';
import { of } from 'rxjs';

import { ApolloService } from './apollo.service';

describe('ApolloService', () => {
  let injector: TestBed;
  let service: ApolloService;
  let apiServiceMock: ApiService;
  let nextReturnValue: Unprocessed<unknown> = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [createMockApiService(() => nextReturnValue)],
      schemas: [NO_ERRORS_SCHEMA],
    });
    injector = getTestBed();
    service = injector.inject(ApolloService);
    apiServiceMock = injector.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Method: getPlayerIdentity', () => {
    beforeEach(() => {
      service.getPlayerIdentities = jasmine
        .createSpy('getPlayerIdentities')
        .and.returnValue(of([]));
      apiServiceMock.getRequest = jasmine.createSpy('getRequest').and.returnValue(of({}));
    });

    it('should call service.getPlayerIdentities', done => {
      service.getPlayerIdentity({ gamertag: 'test' }).subscribe(() => {
        expect(service.getPlayerIdentities).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('Method: getPlayerInventoryByXuid', () => {
    const xuid = fakeXuid();

    beforeEach(() => {
      apiServiceMock.getRequest = jasmine.createSpy('getRequest').and.returnValue(of([]));
    });

    it('should call apiServiceMock.getRequest', done => {
      service.getPlayerInventoryByXuid(xuid).subscribe(() => {
        expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
          `${service.basePath}/player/xuid(${xuid})/inventory`,
        );
        done();
      });
    });
  });

  describe('Method: getPlayerIdentities', () => {
    beforeEach(() => {
      apiServiceMock.postRequest = jasmine.createSpy('postRequest').and.returnValue(of([]));
    });

    it('should call apiServiceMock.postRequest', done => {
      service.getPlayerIdentities([]).subscribe(() => {
        expect(apiServiceMock.postRequest).toHaveBeenCalledWith(
          `${service.basePath}/players/identities`,
          jasmine.any(Object),
        );
        done();
      });
    });
  });

  describe('Method: getPlayerDetailsByGamertag', () => {
    let expectedGamertag: string;

    beforeEach(() => {
      expectedGamertag = 'test-gamertag';
      nextReturnValue = {};
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

  describe('Method: getLspGroups', () => {
    it('should call API service getRequest', done => {
      service.getLspGroups().subscribe(() => {
        expect(apiServiceMock.getRequest).toHaveBeenCalledWith(`${service.basePath}/groups`);
        done();
      });
    });
  });

  describe('Method: getGiftHistoryByXuid', () => {
    const expectedXuid = BigInt(123456789);

    beforeEach(() => {
      apiServiceMock.getRequest = jasmine.createSpy('getRequest').and.returnValue(of([]));
    });

    it('should call API service getRequest with the expected params', done => {
      service.getGiftHistoryByXuid(expectedXuid).subscribe(() => {
        expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
          `${service.basePath}/player/xuid(${expectedXuid})/giftHistory`,
        );
        done();
      });
    });
  });

  describe('Method: getGiftHistoryByLspGroup', () => {
    const expectedLspGroupId = BigInt(1234);

    beforeEach(() => {
      apiServiceMock.getRequest = jasmine.createSpy('getRequest').and.returnValue(of([]));
    });

    it('should call API service getRequest with the expected params', done => {
      service.getGiftHistoryByXuid(expectedLspGroupId).subscribe(() => {
        expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
          `${service.basePath}/player/xuid(${expectedLspGroupId})/giftHistory`,
        );
        done();
      });
    });
  });

  describe('Method: postGiftPlayers', () => {
    const gift: ApolloGroupGift = {
      xuids: [BigInt(123456789)],
      giftReason: 'unit testing gift',
      inventory: {
        creditRewards: [],
        cars: [],
        vanityItems: [],
      },
    };

    beforeEach(() => {
      apiServiceMock.postRequest = jasmine.createSpy('postRequest').and.returnValue(of([]));
    });

    it('should call API service postRequest with the expected params', done => {
      service.postGiftPlayers(gift).subscribe(() => {
        expect(apiServiceMock.postRequest).toHaveBeenCalledWith(
          `${service.basePath}/gifting/players`,
          gift,
        );
        done();
      });
    });
  });

  describe('Method: postGiftPlayersUsingBackgroundTask', () => {
    const gift: ApolloGroupGift = {
      xuids: [BigInt(123456789)],
      giftReason: 'unit testing gift',
      inventory: {
        creditRewards: [],
        cars: [],
        vanityItems: [],
      },
    };

    beforeEach(() => {
      apiServiceMock.postRequest = jasmine.createSpy('postRequest').and.returnValue(of([]));
    });

    it('should call API service postRequest with the expected params', done => {
      service.postGiftPlayersUsingBackgroundTask(gift).subscribe(() => {
        expect(apiServiceMock.postRequest).toHaveBeenCalledWith(
          `${service.basePath}/gifting/players/useBackgroundProcessing`,
          gift,
        );
        done();
      });
    });
  });

  describe('Method: postGiftLspGroup', () => {
    const lspGroup: LspGroup = { id: BigInt(123), name: 'test-lsp-group' };
    const gift: ApolloGift = {
      giftReason: 'unit testing gift',
      inventory: {
        creditRewards: [],
        cars: [],
        vanityItems: [],
      },
    };

    beforeEach(() => {
      apiServiceMock.postRequest = jasmine.createSpy('postRequest').and.returnValue(of([]));
    });

    it('should call API service postRequest with the expected params', done => {
      service.postGiftLspGroup(lspGroup, gift).subscribe(() => {
        expect(apiServiceMock.postRequest).toHaveBeenCalledWith(
          `${service.basePath}/gifting/groupId(${lspGroup.id})`,
          gift,
        );
        done();
      });
    });
  });
});
