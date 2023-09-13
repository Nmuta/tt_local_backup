import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockPlayerCreditUpdatesService } from './woodstock-credit-updates.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'WoodstockLeaderboardTalentService', () => {
  let service: WoodstockPlayerCreditUpdatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WoodstockPlayerCreditUpdatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
