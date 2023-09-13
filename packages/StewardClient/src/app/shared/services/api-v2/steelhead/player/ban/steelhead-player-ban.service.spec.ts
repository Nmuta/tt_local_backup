import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createMockApiV2Service } from '@services/api-v2/api-v2.service.mock';
import { SteelheadPlayerBanService } from './steelhead-player-ban.service';

describe('SteelheadPlayerBanService', () => {
  let service: SteelheadPlayerBanService;
  const nextReturnValue: unknown = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [createMockApiV2Service(() => nextReturnValue)],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(SteelheadPlayerBanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
