import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadUgcVisibilityService } from './steelhead-ugc-visibility.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SteelheadUgcVisibilityService', () => {
  let service: SteelheadUgcVisibilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadUgcVisibilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
