import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadPlayerInventoryService } from './steelhead-player-inventory.service';
import { fakeXuid, faker } from '@interceptors/fake-api/utility';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { createMockApiV2Service } from '@services/api-v2/api-v2.service.mock';
import { of } from 'rxjs';
import { EMPTY_STEELHEAD_PLAYER_INVENTORY } from '@models/steelhead';
import BigNumber from 'bignumber.js';
import { PlayerInventoryCarItem } from '@models/player-inventory-item';
import { FullPlayerInventoryProfile } from '@models/player-inventory-profile';

describe('SteelheadPlayerInventoryService', () => {
  let service: SteelheadPlayerInventoryService;
  let apiServiceMock: ApiV2Service;
  const nextReturnValue: unknown = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [createMockApiV2Service(() => nextReturnValue)],
    });

    service = TestBed.inject(SteelheadPlayerInventoryService);
    apiServiceMock = TestBed.inject(ApiV2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Method: getInventoryByXuid$', () => {
    const xuid = fakeXuid();
    const fakeInventory = EMPTY_STEELHEAD_PLAYER_INVENTORY;

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine
        .createSpy('getRequest')
        .and.returnValue(of(fakeInventory));
    });

    it('should call service.getRequest$ with correct params', done => {
      service.getInventoryByXuid$(xuid).subscribe(response => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/${xuid}/inventory`,
        );

        expect(response).toEqual(fakeInventory);
        done();
      });
    });
  });

  describe('Method: getInventoryByProfileId$', () => {
    const xuid = fakeXuid();
    const profileId = new BigNumber(faker.datatype.number());
    const fakeInventory = EMPTY_STEELHEAD_PLAYER_INVENTORY;

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine
        .createSpy('getRequest')
        .and.returnValue(of(fakeInventory));
    });

    it('should call service.getRequest$ with correct params', done => {
      service.getInventoryByProfileId$(xuid, profileId).subscribe(response => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/${xuid}/inventory/profile/${profileId}`,
        );

        expect(response).toEqual(fakeInventory);
        done();
      });
    });
  });

  describe('Method: getInventoryCarByProfileId$', () => {
    const xuid = fakeXuid();
    const profileId = new BigNumber(faker.datatype.number());
    const carVin = faker.datatype.uuid();
    const fakeInventoryCarItem = { id: new BigNumber(faker.datatype.number()) };

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine
        .createSpy('getRequest')
        .and.returnValue(of(fakeInventoryCarItem));
    });

    it('should call service.getRequest$ with correct params', done => {
      service.getInventoryCarByProfileId$(xuid, profileId, carVin).subscribe(response => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/${xuid}/inventory/profile/${profileId}/car/${carVin}`,
        );

        expect(response).toEqual(fakeInventoryCarItem as PlayerInventoryCarItem);
        done();
      });
    });
  });

  describe('Method: getInventoryProfilesByXuid$', () => {
    const xuid = fakeXuid();
    const fakeProfiles = [
      { profileId: new BigNumber(faker.datatype.number()) },
      { profileId: new BigNumber(faker.datatype.number()) },
    ];

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine
        .createSpy('getRequest')
        .and.returnValue(of(fakeProfiles));
    });

    it('should call service.getRequest$ with correct params', done => {
      service.getInventoryProfilesByXuid$(xuid).subscribe(response => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/${xuid}/inventory/profiles`,
        );

        expect(response).toEqual(fakeProfiles as FullPlayerInventoryProfile[]);
        done();
      });
    });
  });
});
