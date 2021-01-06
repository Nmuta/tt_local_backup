import { TestBed, getTestBed } from '@angular/core/testing';
import { ApiService, createMockApiService } from '@shared/services/api';
import { of } from 'rxjs';
import { GravityService } from './gravity.service';
import { GravityPlayerInventory } from '@models/gravity';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { GiftHistoryAntecedent } from '@shared/constants';
import { faker } from '@interceptors/fake-api/utility';
import { NO_ERRORS_SCHEMA } from '@angular/core';

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
      service.getPlayerIdentities = jasmine.createSpy('getPlayerIdentities').and.returnValue(of([]));
      apiServiceMock.getRequest = jasmine.createSpy('getRequest').and.returnValue(of({}));
    });

    it('should call service.getPlayerIdentities', (done) => {
      service.getPlayerIdentity({} as any).subscribe(() => {
        expect(service.getPlayerIdentities).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('Method: getPlayerIdentities', () => {
    beforeEach(() => {
      apiServiceMock.postRequest = jasmine.createSpy('postRequest').and.returnValue(of([]));
    });

    it('should call apiServiceMock.postRequest', (done) => {
      service.getPlayerIdentities([] as any).subscribe(() => {
        expect(apiServiceMock.postRequest).toHaveBeenCalledWith(
          `${service.basePath}/players/identities`,
          jasmine.any(Object),
          null,
          jasmine.any(HttpHeaders),
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

  describe('Method: getPlayerDetailsByXuid', () => {
    let expectedXuid;

    beforeEach(() => {
      expectedXuid = 'test-xuid';
      apiServiceMock.getRequest = jasmine.createSpy('getRequest').and.returnValue(of({}));
    });

    it('should call API service getRequest with the expected params', done => {
      service.getPlayerDetailsByXuid(expectedXuid).subscribe(() => {
        expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
          `${service.basePath}/player/xuid(${expectedXuid})/details`,
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

  describe('Method: getPlayerInventoryByXuid', () => {
    let expectedXuid;

    beforeEach(() => {
      expectedXuid = 'test-xuid';
      apiServiceMock.getRequest = jasmine.createSpy('getRequest').and.returnValue(of({}));
    });

    it('should call API service getRequest with the expected params', done => {
      service.getPlayerInventoryByXuid(expectedXuid).subscribe(() => {
        expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
          `${service.basePath}/player/inventory/xuid(${expectedXuid})`,
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
          `${service.basePath}/player/inventory/t10Id(${expectedT10Id})`,
        );
        done();
      });
    });
  });

  describe('Method: getPlayerInventoryByProfileIdWithXuid', () => {
    let expectedXuid;
    let expectedProfileId;

    beforeEach(() => {
      expectedXuid = 'test-xuid';
      expectedProfileId = 'test-profile-id';
      apiServiceMock.getRequest = jasmine.createSpy('getRequest').and.returnValue(of({}));
    });

    it('should call API service getRequest with the expected params', done => {
      service
        .getPlayerInventoryByProfileIdWithXuid(expectedXuid, expectedProfileId)
        .subscribe(() => {
          expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
            `${service.basePath}/player/inventory/xuid(${expectedXuid})/profileId(${expectedProfileId})`,
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
        .getPlayerInventoryByProfileIdWithT10Id(expectedt10Id, expectedProfileId)
        .subscribe(() => {
          expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
            `${service.basePath}/player/inventory/t10Id(${expectedt10Id})/profileId(${expectedProfileId})`,
          );
          done();
        });
    });
  });

  describe('Method: updatePlayerInventoryByXuid', () => {
    let expectedInventory: Partial<GravityPlayerInventory>;
    let expectedParams: HttpParams;

    beforeEach(() => {
      expectedInventory = {
        xuid:
          BigInt(Number.MAX_SAFE_INTEGER) + BigInt(faker.random.number(Number.MAX_SAFE_INTEGER)),
      };
      expectedParams = new HttpParams().append('useBackgroundProcessing', false.toString());
      apiServiceMock.postRequest = jasmine.createSpy('postRequest').and.returnValue(of({}));
    });

    it('should call API service postRequest with the expected params', done => {
      service
        .updatePlayerInventoryByXuid(expectedInventory as GravityPlayerInventory)
        .subscribe(() => {
          expect(apiServiceMock.postRequest).toHaveBeenCalledWith(
            `${service.basePath}/player/inventory/xuid`,
            expectedInventory,
            expectedParams,
          );
          done();
        });
    });

    describe('When xuid is not provided', () => {
      beforeEach(() => {
        expectedInventory = {};
        expectedParams = new HttpParams().append('useBackgroundProcessing', false.toString());
        apiServiceMock.postRequest = jasmine.createSpy('postRequest').and.returnValue(of({}));
      });

      it('should throw error from observable', done => {
        service
          .updatePlayerInventoryByXuid(expectedInventory as GravityPlayerInventory, true)
          .subscribe(
            () => {
              expect(false).toBeTruthy();
              done();
            },
            () => {
              expect(true).toBeTruthy();
              done();
            },
          );
      });
    });

    describe('When background processing is set to true', () => {
      beforeEach(() => {
        expectedParams = new HttpParams().append('useBackgroundProcessing', true.toString());
      });

      it('should call API service postRequest with the expected param', done => {
        service
          .updatePlayerInventoryByXuid(expectedInventory as GravityPlayerInventory, true)
          .subscribe(() => {
            expect(apiServiceMock.postRequest).toHaveBeenCalledWith(
              `${service.basePath}/player/inventory/xuid`,
              expectedInventory,
              expectedParams,
            );
            done();
          });
      });
    });
  });

  describe('Method: updatePlayerInventoryByT10Id', () => {
    let expectedInventory: Partial<GravityPlayerInventory>;
    let expectedParams: HttpParams;

    beforeEach(() => {
      expectedInventory = { turn10Id: 't10Id' };
      expectedParams = new HttpParams().append('useBackgroundProcessing', false.toString());
      apiServiceMock.postRequest = jasmine.createSpy('postRequest').and.returnValue(of({}));
    });

    it('should call API service postRequest with the expected params', done => {
      service
        .updatePlayerInventoryByT10Id(expectedInventory as GravityPlayerInventory)
        .subscribe(() => {
          expect(apiServiceMock.postRequest).toHaveBeenCalledWith(
            `${service.basePath}/player/inventory/t10Id`,
            expectedInventory,
            expectedParams,
          );
          done();
        });
    });

    describe('When xuid is not provided', () => {
      beforeEach(() => {
        expectedInventory = {};
        expectedParams = new HttpParams().append('useBackgroundProcessing', false.toString());
        apiServiceMock.postRequest = jasmine.createSpy('postRequest').and.returnValue(of({}));
      });

      it('should throw error from observable', done => {
        service
          .updatePlayerInventoryByT10Id(expectedInventory as GravityPlayerInventory, true)
          .subscribe(
            () => {
              expect(false).toBeTruthy();
              done();
            },
            () => {
              expect(true).toBeTruthy();
              done();
            },
          );
      });
    });

    describe('When background processing is set to true', () => {
      beforeEach(() => {
        expectedParams = new HttpParams().append('useBackgroundProcessing', true.toString());
      });

      it('should call API service postRequest with the expected param', done => {
        service
          .updatePlayerInventoryByT10Id(expectedInventory as GravityPlayerInventory, true)
          .subscribe(() => {
            expect(apiServiceMock.postRequest).toHaveBeenCalledWith(
              `${service.basePath}/player/inventory/t10Id`,
              expectedInventory,
              expectedParams,
            );
            done();
          });
      });
    });
  });

  describe('Method: getGameSettings', () => {
    let expectedGameSettingsId;

    beforeEach(() => {
      expectedGameSettingsId = 'test-game-sttings-id';
      apiServiceMock.getRequest = jasmine.createSpy('getRequest').and.returnValue(of({}));
    });

    it('should call API service getRequest with the expected params', done => {
      service.getGameSettings(expectedGameSettingsId).subscribe(() => {
        expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
          `${service.basePath}/data/gameSettingsId(${expectedGameSettingsId})`,
        );
        done();
      });
    });
  });

  describe('Method: getGiftHistories', () => {
    let expectedGiftHistoryAntecedent;
    let expectedGiftRecipientId;

    beforeEach(() => {
      expectedGiftHistoryAntecedent = GiftHistoryAntecedent.Xuid;
      expectedGiftRecipientId = 'test-xuid';
      apiServiceMock.getRequest = jasmine.createSpy('getRequest').and.returnValue(of({}));
    });

    it('should call API service getRequest with the expected params', done => {
      service
        .getGiftHistories(expectedGiftHistoryAntecedent, expectedGiftRecipientId)
        .subscribe(() => {
          expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
            `${service.basePath}/giftHistory/giftRecipientId/(${expectedGiftRecipientId})/giftHistoryAntecedent/(${expectedGiftHistoryAntecedent})`,
          );
          done();
        });
    });
  });
});
