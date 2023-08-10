import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import faker from '@faker-js/faker';
import { LspGroup } from '@models/lsp-group';
import { SteelheadGift } from '@models/steelhead';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { createMockApiV2Service } from '@services/api-v2/api-v2.service.mock';
import BigNumber from 'bignumber.js';
import { of } from 'rxjs';

import { SteelheadGroupGiftService } from './steelhead-group-gift.service';

describe('SteelheadGroupGiftService', () => {
  let service: SteelheadGroupGiftService;
  const nextReturnValue: unknown = {};
  let apiServiceMock: ApiV2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [createMockApiV2Service(() => nextReturnValue)],
      schemas: [NO_ERRORS_SCHEMA],
    });

    service = TestBed.inject(SteelheadGroupGiftService);
    apiServiceMock = TestBed.inject(ApiV2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Method: postGiftLspGroup$', () => {
    const lspGroup: LspGroup = { id: new BigNumber(123), name: 'test-lsp-group' };
    const gift: SteelheadGift = {
      titleMessageId: faker.datatype.uuid(),
      bodyMessageId: faker.datatype.uuid(),
      expireAfterDays: new BigNumber(faker.datatype.number()),
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
      service.postGiftLspGroup$(lspGroup.id, gift).subscribe(() => {
        expect(apiServiceMock.postRequest$).toHaveBeenCalledWith(
          `${service.basePath}/${lspGroup.id}/gift`,
          gift,
        );
        done();
      });
    });
  });
});
