import { TestBed } from '@angular/core/testing';

import { WoodstockCarsCacheService } from './cars-cache.service';

describe('CarsCacheService', () => {
  let service: WoodstockCarsCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WoodstockCarsCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
