import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockUgcVisibilityService } from './woodstock-ugc-visibility.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('WoodstockUgcVisibilityService', () => {
  let service: WoodstockUgcVisibilityService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule],
      }),
    );
    service = TestBed.inject(WoodstockUgcVisibilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
