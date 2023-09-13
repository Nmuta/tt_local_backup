import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockLeaderboardTalentService } from './woodstock-leaderboard-talent.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('WoodstockLeaderboardTalentService', () => {
  let service: WoodstockLeaderboardTalentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WoodstockLeaderboardTalentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
