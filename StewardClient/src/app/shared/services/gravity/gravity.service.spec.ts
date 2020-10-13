import { TestBed, getTestBed, inject } from '@angular/core/testing';
import { ApiService, createMockApiService } from '@shared/services/api';
import { of } from 'rxjs';
import { GravityService } from './gravity.service';
import { GravityPlayerInventory } from '@models/gravity';
import { HttpParams } from '@angular/common/http';
import { GiftHistoryAntecedent } from '@shared/constants';

describe('service: GravityService', () => {
  let injector: TestBed;
  let service: GravityService;
  let apiServiceMock: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ApiService, createMockApiService()],
    });
    injector = getTestBed();
    service = injector.inject(GravityService);
    apiServiceMock = injector.inject(ApiService);
  });

  describe('Method: getPlayerDetailsByGamertag', () => {
    var expectedGamertag;
    beforeEach(() => {
      expectedGamertag = 'test-gamertag';
      apiServiceMock.getRequest = jasmine
        .createSpy('getRequest')
        .and.returnValue(of({}));
    });
    it('should call API service getRequest with the expected params', done => {
      service.getPlayerDetailsByGamertag(expectedGamertag).subscribe(res => {
        expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
          `${service.basePath}/player/details/gamertag(${expectedGamertag})`
        );
        done();
      });
    });
  });

  describe('Method: getPlayerDetailsByXuid', () => {
    var expectedXuid;
    beforeEach(() => {
      expectedXuid = 'test-xuid';
      apiServiceMock.getRequest = jasmine
        .createSpy('getRequest')
        .and.returnValue(of({}));
    });
    it('should call API service getRequest with the expected params', done => {
      service.getPlayerDetailsByXuid(expectedXuid).subscribe(res => {
        expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
          `${service.basePath}/player/details/xuid(${expectedXuid})`
        );
        done();
      });
    });
  });

  describe('Method: getPlayerDetailsByT10Id', () => {
    var expectedT10Id;
    beforeEach(() => {
      expectedT10Id = 'test-t10-id';
      apiServiceMock.getRequest = jasmine
        .createSpy('getRequest')
        .and.returnValue(of({}));
    });
    it('should call API service getRequest with the expected params', done => {
      service.getPlayerDetailsByT10Id(expectedT10Id).subscribe(res => {
        expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
          `${service.basePath}/player/details/t10Id(${expectedT10Id})`
        );
        done();
      });
    });
  });

  describe('Method: getPlayerInventoryByXuid', () => {
    var expectedXuid;
    beforeEach(() => {
      expectedXuid = 'test-xuid';
      apiServiceMock.getRequest = jasmine
        .createSpy('getRequest')
        .and.returnValue(of({}));
    });
    it('should call API service getRequest with the expected params', done => {
      service.getPlayerInventoryByXuid(expectedXuid).subscribe(res => {
        expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
          `${service.basePath}/player/inventory/xuid(${expectedXuid})`
        );
        done();
      });
    });
  });

  describe('Method: getPlayerInventoryByT10Id', () => {
    var expectedT10Id;
    beforeEach(() => {
      expectedT10Id = 'test-t10-id';
      apiServiceMock.getRequest = jasmine
        .createSpy('getRequest')
        .and.returnValue(of({}));
    });
    it('should call API service getRequest with the expected params', done => {
      service.getPlayerInventoryByT10Id(expectedT10Id).subscribe(res => {
        expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
          `${service.basePath}/player/inventory/t10Id(${expectedT10Id})`
        );
        done();
      });
    });
  });

  describe('Method: getPlayerInventoryByProfileIdWithXuid', () => {
    var expectedXuid;
    var expectedProfileId;
    beforeEach(() => {
      expectedXuid = 'test-xuid';
      expectedProfileId = 'test-profile-id';
      apiServiceMock.getRequest = jasmine
        .createSpy('getRequest')
        .and.returnValue(of({}));
    });
    it('should call API service getRequest with the expected params', done => {
      service.getPlayerInventoryByProfileIdWithXuid(expectedXuid, expectedProfileId).subscribe(res => {
        expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
          `${service.basePath}/player/inventory/xuid(${expectedXuid})/profileId(${expectedProfileId})`
        );
        done();
      });
    });
  });

  describe('Method: getPlayerInventoryByProfileIdWithT10Id', () => {
    var expectedt10Id;
    var expectedProfileId;
    beforeEach(() => {
      expectedt10Id = 'test-t10-id';
      expectedProfileId = 'test-profile-id';
      apiServiceMock.getRequest = jasmine
        .createSpy('getRequest')
        .and.returnValue(of({}));
    });
    it('should call API service getRequest with the expected params', done => {
      service.getPlayerInventoryByProfileIdWithT10Id(expectedt10Id, expectedProfileId).subscribe(res => {
        expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
          `${service.basePath}/player/inventory/t10Id(${expectedt10Id})/profileId(${expectedProfileId})`
        );
        done();
      });
    });
  });



  describe('Method: updatePlayerInventoryByXuid', () => {
    var expectedInventory: GravityPlayerInventory;
    var expectedParams: HttpParams;
    beforeEach(() => {
      expectedInventory = { xuid: 'test-xuid' };
      expectedParams = new HttpParams()
        .append('useBackgroundProcessing', false.toString());
      apiServiceMock.postRequest = jasmine
        .createSpy('postRequest')
        .and.returnValue(of({}));
    });
    it('should call API service postRequest with the expected params', done => {
      service.updatePlayerInventoryByXuid(expectedInventory).subscribe(res => {
        expect(apiServiceMock.postRequest).toHaveBeenCalledWith(
          `${service.basePath}/player/inventory/xuid`,
          expectedInventory,
          expectedParams
        );
        done();
      });
    });

    describe('When xuid is not provided', () => {
      beforeEach(() => {
        expectedInventory = {};
        expectedParams = new HttpParams()
          .append('useBackgroundProcessing', false.toString());
        apiServiceMock.postRequest = jasmine
          .createSpy('postRequest')
          .and.returnValue(of({}));
      });
      it('should throw error from observable', done => {
        service.updatePlayerInventoryByXuid(expectedInventory, true).subscribe(
          res => {
            expect(false).toBeTruthy();
            done();
          },
          err => {
            expect(true).toBeTruthy();
            done();
          });
      });
    });

    describe('When background processing is set to true', () => {
      beforeEach(() => {
        expectedParams = new HttpParams()
          .append('useBackgroundProcessing', true.toString());
      });
      it('should call API service postRequest with the expected param', done => {
        service.updatePlayerInventoryByXuid(expectedInventory, true).subscribe(res => {
          expect(apiServiceMock.postRequest).toHaveBeenCalledWith(
            `${service.basePath}/player/inventory/xuid`,
            expectedInventory,
            expectedParams
          );
          done();
        });
      });
    });
  });

  describe('Method: updatePlayerInventoryByT10Id', () => {
    var expectedInventory: GravityPlayerInventory;
    var expectedParams: HttpParams;
    beforeEach(() => {
      expectedInventory = { turn10Id: 't10Id' };
      expectedParams = new HttpParams()
        .append('useBackgroundProcessing', false.toString());
      apiServiceMock.postRequest = jasmine
        .createSpy('postRequest')
        .and.returnValue(of({}));
    });
    it('should call API service postRequest with the expected params', done => {
      service.updatePlayerInventoryByT10Id(expectedInventory).subscribe(res => {
        expect(apiServiceMock.postRequest).toHaveBeenCalledWith(
          `${service.basePath}/player/inventory/t10Id`,
          expectedInventory,
          expectedParams
        );
        done();
      });
    });

    describe('When xuid is not provided', () => {
      beforeEach(() => {
        expectedInventory = {};
        expectedParams = new HttpParams()
          .append('useBackgroundProcessing', false.toString());
        apiServiceMock.postRequest = jasmine
          .createSpy('postRequest')
          .and.returnValue(of({}));
      });
      it('should throw error from observable', done => {
        service.updatePlayerInventoryByT10Id(expectedInventory, true).subscribe(
          res => {
            expect(false).toBeTruthy();
            done();
          },
          err => {
            expect(true).toBeTruthy();
            done();
          });
      });
    });

    describe('When background processing is set to true', () => {
      beforeEach(() => {
        expectedParams = new HttpParams()
          .append('useBackgroundProcessing', true.toString());
      });
      it('should call API service postRequest with the expected param', done => {
        service.updatePlayerInventoryByT10Id(expectedInventory, true).subscribe(res => {
          expect(apiServiceMock.postRequest).toHaveBeenCalledWith(
            `${service.basePath}/player/inventory/t10Id`,
            expectedInventory,
            expectedParams
          );
          done();
        });
      });
    });
  });

  describe('Method: getGameSettings', () => {
    var expectedGameSettingsId;
    beforeEach(() => {
      expectedGameSettingsId = 'test-game-sttings-id';
      apiServiceMock.getRequest = jasmine
        .createSpy('getRequest')
        .and.returnValue(of({}));
    });
    it('should call API service getRequest with the expected params', done => {
      service.getGameSettings(expectedGameSettingsId).subscribe(res => {
        expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
          `${service.basePath}/data/gameSettingsId(${expectedGameSettingsId})`
        );
        done();
      });
    });
  });

  describe('Method: getGiftHistories', () => {
    var expectedGiftHistoryAntecedent;
    var expectedGiftRecipientId
    beforeEach(() => {
      expectedGiftHistoryAntecedent = GiftHistoryAntecedent.Xuid;
      expectedGiftRecipientId = 'test-xuid';
      apiServiceMock.getRequest = jasmine
        .createSpy('getRequest')
        .and.returnValue(of({}));
    });
    it('should call API service getRequest with the expected params', done => {
      service.getGiftHistories(expectedGiftHistoryAntecedent, expectedGiftRecipientId).subscribe(res => {
        expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
          `${service.basePath}/giftHistory/giftRecipientId/(${expectedGiftRecipientId})/giftHistoryAntecedent/(${expectedGiftHistoryAntecedent})`
        );
        done();
      });
    });
  });
});
