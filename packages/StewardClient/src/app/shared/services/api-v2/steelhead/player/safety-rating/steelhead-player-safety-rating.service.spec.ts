import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadPlayerSafetyRatingService } from './steelhead-player-safety-rating.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SteelheadPlayerSafetyRatingService', () => {
  let service: SteelheadPlayerSafetyRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule],
      }),
    );
    service = TestBed.inject(SteelheadPlayerSafetyRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
