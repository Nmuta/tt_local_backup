import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadUgcFeaturedStatusService } from './steelhead-ugc-featured-status.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'FindService', () => {
  let service: SteelheadUgcFeaturedStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadUgcFeaturedStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
