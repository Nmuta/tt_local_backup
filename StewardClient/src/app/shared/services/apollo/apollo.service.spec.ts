import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { ApolloPlayerXuidConsolesFakeApi } from '@interceptors/fake-api/apis/title/apollo/player/xuid/consoleDetails';
import { ApolloPlayerXuidConsoleSharedConsoleUsersFakeApi } from '@interceptors/fake-api/apis/title/apollo/player/xuid/sharedConsoleUsers';
import { ApolloPlayerXuidUserFlagsFakeApi } from '@interceptors/fake-api/apis/title/apollo/player/xuid/userFlags';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { ApolloGift, ApolloGroupGift, ApolloUserFlags } from '@models/apollo';
import { LspGroup } from '@models/lsp-group';
import { ApiService, createMockApiService } from '@services/api';
import { of } from 'rxjs';

import { ApolloService } from './apollo.service';

describe('ApolloService', () => {
  let injector: TestBed;
  let service: ApolloService;
  let apiServiceMock: ApiService;
  let nextReturnValue: unknown = {};

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
    const typedReturnValue = (nextReturnValue = ApolloPlayerXuidUserFlagsFakeApi.make());
    service.putFlagsByXuid$(fakeXuid(), typedReturnValue as ApolloUserFlags).subscribe(output => {
      expect(output as unknown).toEqual(
        nextReturnValue as unknown,
        'fields should not be modified',
      );
      done();
    });
  });

  it('handles getSharedConsoleUsersByXuid', done => {
    const typedReturnValue = (nextReturnValue =
      ApolloPlayerXuidConsoleSharedConsoleUsersFakeApi.makeMany());
    service.getSharedConsoleUsersByXuid$(fakeXuid()).subscribe(output => {
      expect(output as unknown).toEqual(
        typedReturnValue as unknown,
        'fields should not be modified',
      );
      done();
    });
  });

  it('handles getConsoleDetailsByXuid', done => {
    nextReturnValue = ApolloPlayerXuidConsolesFakeApi.makeMany();
    service.getConsoleDetailsByXuid$(new BigNumber(fakeXuid())).subscribe(output => {
      expect(output as unknown).toEqual(
        nextReturnValue as unknown,
        'fields should not be modified',
      );
      done();
    });
  });

  describe('Method: getPlayerIdentity', () => {
    beforeEach(() => {
      service.getPlayerIdentities$ = jasmine
        .createSpy('getPlayerIdentities')
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

  describe('Method: getPlayerInventoryByXuid', () => {
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

  describe('Method: getPlayerIdentities', () => {
    beforeEach(() => {
      apiServiceMock.postRequest$ = jasmine.createSpy('postRequest').and.returnValue(of([]));
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

  describe('Method: getPlayerDetailsByGamertag', () => {
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

  describe('Method: getLspGroups', () => {
    it('should call API service getRequest', done => {
      service.getLspGroups$().subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(`${service.basePath}/groups`);
        done();
      });
    });
  });

  describe('Method: getGiftHistoryByXuid', () => {
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

  describe('Method: postGiftPlayers', () => {
    const gift: ApolloGroupGift = {
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

  describe('Method: postGiftPlayersUsingBackgroundTask', () => {
    const gift: ApolloGroupGift = {
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

  describe('Method: postGiftLspGroup', () => {
    const lspGroup: LspGroup = { id: new BigNumber(123), name: 'test-lsp-group' };
    const gift: ApolloGift = {
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
});
