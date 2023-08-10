import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import faker from '@faker-js/faker';
import { SteelheadGroupGift } from '@models/steelhead';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { createMockApiV2Service } from '@services/api-v2/api-v2.service.mock';
import BigNumber from 'bignumber.js';
import { of } from 'rxjs';

import { SteelheadPlayersGiftService } from './steelhead-players-gift.service';

describe('SteelheadPlayersGiftService', () => {
  let service: SteelheadPlayersGiftService;
  const nextReturnValue: unknown = {};
  let apiServiceMock: ApiV2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [createMockApiV2Service(() => nextReturnValue)],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(SteelheadPlayersGiftService);
    apiServiceMock = TestBed.inject(ApiV2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Method: postGiftPlayersUsingBackgroundTask$', () => {
    const gift: SteelheadGroupGift = {
      titleMessageId: faker.datatype.uuid(),
      bodyMessageId: faker.datatype.uuid(),
      expireAfterDays: new BigNumber(faker.datatype.number()),
      xuids: [new BigNumber(123456789)],
      giftReason: 'unit testing gift',
      inventory: {
        creditRewards: [],
        cars: [],
        vanityItems: [],
        driverSuits: [],
      },
    };

    beforeEach(() => {
      apiServiceMock.postRequest$ = jasmine.createSpy('postRequest').and.returnValue(of([]));
    });

    it('should call API service postRequest with the expected params', done => {
      service.postGiftPlayersUsingBackgroundTask$(gift).subscribe(() => {
        expect(apiServiceMock.postRequest$).toHaveBeenCalledWith(
          `${service.basePath}/useBackgroundProcessing`,
          gift,
        );
        done();
      });
    });
  });
});
