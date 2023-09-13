import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadPlayerFlagsService } from './steelhead-player-flags.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SteelheadPlayerFlagsService', () => {
  let service: SteelheadPlayerFlagsService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule],
      }),
    );
    service = TestBed.inject(SteelheadPlayerFlagsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
