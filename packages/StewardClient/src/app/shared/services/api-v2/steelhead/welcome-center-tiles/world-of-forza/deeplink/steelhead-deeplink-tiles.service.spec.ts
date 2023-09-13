import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadDeeplinkTileService } from './steelhead-deeplink-tiles.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'SteelheadDeeplinkTileService', () => {
  let service: SteelheadDeeplinkTileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadDeeplinkTileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
