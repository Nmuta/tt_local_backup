import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadLeaderboardsService } from './steelhead-leaderboards.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'SteelheadLeaderboardsService', () => {
  let service: SteelheadLeaderboardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadLeaderboardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
