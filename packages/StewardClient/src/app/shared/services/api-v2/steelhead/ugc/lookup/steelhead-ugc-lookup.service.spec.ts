import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadUgcLookupService } from './steelhead-ugc-lookup.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SteelheadUgcLookupService', () => {
  let service: SteelheadUgcLookupService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule],
      }),
    );
    service = TestBed.inject(SteelheadUgcLookupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
