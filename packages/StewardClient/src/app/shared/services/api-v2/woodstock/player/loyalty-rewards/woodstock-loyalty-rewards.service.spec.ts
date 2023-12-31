import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockLoyaltyRewardsService } from './woodstock-loyalty-rewards.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('WoodstockLoyaltyRewardsService', () => {
  let service: WoodstockLoyaltyRewardsService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule],
      }),
    );
    service = TestBed.inject(WoodstockLoyaltyRewardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
