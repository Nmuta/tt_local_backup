import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadUgcGeoFlagsService } from './steelhead-ugc-geo-flags.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('FindService', () => {
  let service: SteelheadUgcGeoFlagsService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule],
      }),
    );
    service = TestBed.inject(SteelheadUgcGeoFlagsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
