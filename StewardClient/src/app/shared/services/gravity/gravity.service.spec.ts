import { TestBed, getTestBed } from '@angular/core/testing';
import { ApiService, createMockApiService } from '@shared/services/api';
import { of } from 'rxjs';
import { GravityService } from './gravity.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { GravityGift } from '@models/gravity';

describe('service: GravityService', () => {
  let injector: TestBed;
  let service: GravityService;
  let apiServiceMock: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ApiService, createMockApiService()],
      schemas: [NO_ERRORS_SCHEMA],
    });
    injector = getTestBed();
    service = injector.inject(GravityService);
    apiServiceMock = injector.inject(ApiService);
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

  describe('Method: getPlayerDetailsByT10Id', () => {
    let expectedT10Id;

    beforeEach(() => {
      expectedT10Id = 'test-t10-id';
      apiServiceMock.getRequest = jasmine.createSpy('getRequest').and.returnValue(of({}));
    });

    it('should call API service getRequest with the expected params', done => {
      service.getPlayerDetailsByT10Id(expectedT10Id).subscribe(() => {
        expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
          `${service.basePath}/player/t10Id(${expectedT10Id})/details`,
        );
        done();
      });
    });
  });

  describe('Method: getPlayerInventoryByT10Id', () => {
    let expectedT10Id;

    beforeEach(() => {
      expectedT10Id = 'test-t10-id';
      apiServiceMock.getRequest = jasmine.createSpy('getRequest').and.returnValue(of({}));
    });

    it('should call API service getRequest with the expected params', done => {
      service.getPlayerInventoryByT10Id(expectedT10Id).subscribe(() => {
        expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
          `${service.basePath}/player/t10Id(${expectedT10Id})/inventory`,
        );
        done();
      });
    });
  });

  describe('Method: getPlayerInventoryByProfileIdWithT10Id', () => {
    let expectedt10Id;
    let expectedProfileId;

    beforeEach(() => {
      expectedt10Id = 'test-t10-id';
      expectedProfileId = 'test-profile-id';
      apiServiceMock.getRequest = jasmine.createSpy('getRequest').and.returnValue(of({}));
    });

    it('should call API service getRequest with the expected params', done => {
      service
        .getPlayerInventoryByT10IdAndProfileId(expectedt10Id, expectedProfileId)
        .subscribe(() => {
          expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
            `${service.basePath}/player/t10Id(${expectedt10Id})/profileId(${expectedProfileId})/inventory`,
          );
          done();
        });
    });
  });

  describe('Method: getMasterInventory', () => {
    let expectedGameSettingsId;

    beforeEach(() => {
      expectedGameSettingsId = 'test-game-sttings-id';
      apiServiceMock.getRequest = jasmine.createSpy('getRequest').and.returnValue(of({}));
    });

    it('should call API service getRequest with the expected params', done => {
      service.getMasterInventory(expectedGameSettingsId).subscribe(() => {
        expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
          `${service.basePath}/masterInventory/gameSettingsId(${expectedGameSettingsId})`,
        );
        done();
      });
    });
  });

  describe('Method: getGiftHistoryByT10Id', () => {
    let expectedGiftT10Id;

    beforeEach(() => {
      expectedGiftT10Id = '1234t10Id6789';
      apiServiceMock.getRequest = jasmine.createSpy('getRequest').and.returnValue(of([]));
    });

    it('should call API service getRequest with the expected params', done => {
      service.getGiftHistoryByT10Id(expectedGiftT10Id).subscribe(() => {
        expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
          `${service.basePath}/player/t10Id(${expectedGiftT10Id})/giftHistory`,
        );
        done();
      });
    });
  });

  describe('Method: postGiftPlayersUsingBackgroundTask', () => {
    const t10Id = 'fake-to10-id';
    const gift: GravityGift = {
      giftReason: 'unit testing gift',
      inventory: {
        creditRewards: [],
        cars: [],
        masteryKits: [],
        upgradeKits: [],
        repairKits: [],
        energyRefills: [],
      },
    };

    beforeEach(() => {
      apiServiceMock.postRequest = jasmine.createSpy('postRequest').and.returnValue(of([]));
    });

    it('should call API service postRequest with the expected params', done => {
      service.postGiftPlayerUsingBackgroundTask(t10Id, gift).subscribe(() => {
        expect(apiServiceMock.postRequest).toHaveBeenCalledWith(
          `${service.basePath}/gifting/t10Id(${t10Id})/useBackgroundProcessing`,
          gift,
        );
        done();
      });
    });
  });
});
