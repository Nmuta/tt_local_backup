import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';
import { SteelheadLeaderboardScoresFileService } from './steelhead-leaderboard-scores-file.service';

describe('SteelheadLeaderboardScoresFileService', () => {
  let service: SteelheadLeaderboardScoresFileService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule],
      }),
    );
    service = TestBed.inject(SteelheadLeaderboardScoresFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
