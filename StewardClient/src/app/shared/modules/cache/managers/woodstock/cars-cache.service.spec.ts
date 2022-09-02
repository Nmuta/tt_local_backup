import { TestBed } from '@angular/core/testing';
import { createMockApiService } from '@services/api';

import { WoodstockCarsCacheService } from './cars-cache.service';

describe('CarsCacheService', () => {
  let service: WoodstockCarsCacheService;
  const nextValue = [];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [createMockApiService(() => nextValue)],
    });
    service = TestBed.inject(WoodstockCarsCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
