import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { WoodstockGroupGift } from '@models/woodstock';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { createMockApiV2Service } from '@services/api-v2/api-v2.service.mock';
import BigNumber from 'bignumber.js';
import { of } from 'rxjs';
import { WoodstockPlayersGiftService } from './woodstock-players-gift.service';

describe('WoodstockPlayersGiftService', () => {
  const nextReturnValue: unknown = {};
  let mockService: WoodstockPlayersGiftService;
  let mockApiService: ApiV2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [createMockApiV2Service(() => nextReturnValue)],
      schemas: [NO_ERRORS_SCHEMA],
    });
    mockService = TestBed.inject(WoodstockPlayersGiftService);
    mockApiService = TestBed.inject(ApiV2Service);
  });

  it('should be created', () => {
    expect(mockService).toBeTruthy();
  });

  describe('Method: postGiftPlayersUsingBackgroundTask', () => {
    const gift: WoodstockGroupGift = {
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
      expireAfterDays: fakeBigNumber(),
    };

    beforeEach(() => {
      mockApiService.postRequest$ = jasmine.createSpy('postRequest$').and.returnValue(of([]));
    });

    it('should call API service postRequest$ with the expected params', done => {
      mockService.postGiftPlayersUsingBackgroundTask$(gift).subscribe(() => {
        expect(mockApiService.postRequest$).toHaveBeenCalledWith(
          `${mockService.basePath}/useBackgroundProcessing`,
          gift,
        );
        done();
      });
    });
  });
});
