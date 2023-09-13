import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadPlayerCmsOverrideService } from './steelhead-player-cms-override.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SteelheadPlayerCmsOverrideService', () => {
  let service: SteelheadPlayerCmsOverrideService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule],
      }),
    );
    service = TestBed.inject(SteelheadPlayerCmsOverrideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
