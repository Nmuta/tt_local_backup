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
  let service: WoodstockPlayersGiftService;
  const nextReturnValue: unknown = {};
  let mockService: WoodstockPlayersGiftService;
  let mockApiService: ApiV2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [createMockApiV2Service(() => nextReturnValue)],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(WoodstockPlayersGiftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
