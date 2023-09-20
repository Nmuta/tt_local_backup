import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadPlayerSkillRatingService } from './steelhead-player-skill-rating.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SteelheadPlayerSkillRatingService', () => {
  let service: SteelheadPlayerSkillRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule],
      }),
    );
    service = TestBed.inject(SteelheadPlayerSkillRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
