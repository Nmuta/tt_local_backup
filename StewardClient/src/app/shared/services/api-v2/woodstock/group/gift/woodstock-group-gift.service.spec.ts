import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { LspGroup } from '@models/lsp-group';
import { WoodstockGift } from '@models/woodstock';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { createMockApiV2Service } from '@services/api-v2/api-v2.service.mock';
import BigNumber from 'bignumber.js';
import { of } from 'rxjs';

import { WoodstockGroupGiftService } from './woodstock-group-gift.service';

describe('WoodstockGroupGiftService', () => {
  const nextReturnValue: unknown = {};
  let mockService: WoodstockGroupGiftService;
  let mockApiService: ApiV2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [createMockApiV2Service(() => nextReturnValue)],
      schemas: [NO_ERRORS_SCHEMA],
    });
    mockService = TestBed.inject(WoodstockGroupGiftService);
    mockApiService = TestBed.inject(ApiV2Service);
  });

  it('should be created', () => {
    expect(mockService).toBeTruthy();
  });

  describe('Method: postGiftLspGroup', () => {
    const lspGroup: LspGroup = { id: new BigNumber(123), name: 'test-lsp-group' };
    const gift: WoodstockGift = {
      giftReason: 'unit testing gift',
      inventory: {
        creditRewards: [],
        cars: [],
        vanityItems: [],
        carHorns: [],
        quickChatLines: [],
        emotes: [],
      },
      expireTimeSpanInDays: fakeBigNumber(),
    };

    beforeEach(() => {
      mockApiService.postRequest$ = jasmine.createSpy('postRequest$').and.returnValue(of([]));
    });

    it('should call API service postRequest$ with the expected params', done => {
      mockService.postGiftLspGroup$(lspGroup, gift).subscribe(() => {
        expect(mockApiService.postRequest$).toHaveBeenCalledWith(
          `${mockService.basePath}/${lspGroup.id}/gift`,
          gift,
        );
        done();
      });
    });
  });
});
