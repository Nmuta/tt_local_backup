import { TestBed } from '@angular/core/testing';
import { createMockApiService } from '@services/api';

import { WoodstockCarsCacheService } from './cars-cache.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

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
