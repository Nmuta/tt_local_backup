import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createMockApiV2Service } from '@services/api-v2/api-v2.service.mock';
import { SteelheadPlayersBanService } from './steelhead-players-ban.service';

describe('SteelheadPlayersBanService', () => {
  let service: SteelheadPlayersBanService;
  const nextReturnValue: unknown = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [createMockApiV2Service(() => nextReturnValue)],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(SteelheadPlayersBanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
