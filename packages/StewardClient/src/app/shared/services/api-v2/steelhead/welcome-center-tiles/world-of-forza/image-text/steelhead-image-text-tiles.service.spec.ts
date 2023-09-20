import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadImageTextTileService } from './steelhead-image-text-tiles.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SteelheadImageTextTileService', () => {
  let service: SteelheadImageTextTileService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule],
      }),
    );
    service = TestBed.inject(SteelheadImageTextTileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
