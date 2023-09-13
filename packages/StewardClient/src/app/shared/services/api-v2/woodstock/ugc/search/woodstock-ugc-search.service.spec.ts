import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { WoodstockUgcSearchService } from './woodstock-ugc-search.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('FindService', () => {
  let service: WoodstockUgcSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule],
      }),
    );
    service = TestBed.inject(WoodstockUgcSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
