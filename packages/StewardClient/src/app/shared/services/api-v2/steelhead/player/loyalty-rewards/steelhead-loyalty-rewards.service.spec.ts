import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadLoyaltyRewardsService } from './steelhead-loyalty-rewards.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SteelheadLoyaltyRewardsService', () => {
  let service: SteelheadLoyaltyRewardsService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule],
      }),
    );
    service = TestBed.inject(SteelheadLoyaltyRewardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
