import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createMockApiV2Service } from '@services/api-v2/api-v2.service.mock';

import { WoodstockGroupGiftService } from './woodstock-group-gift.service';

describe('WoodstockGroupGiftService', () => {
  let service: WoodstockGroupGiftService;
  const nextReturnValue: unknown = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [createMockApiV2Service(() => nextReturnValue)],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(WoodstockGroupGiftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
