import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createMockApiV2Service } from '@services/api-v2/api-v2.service.mock';

import { WoodstockPlayersGiftService } from './woodstock-players-gift.service';

describe('WoodstockPlayersGiftService', () => {
  let service: WoodstockPlayersGiftService;
  const nextReturnValue: unknown = {};

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
