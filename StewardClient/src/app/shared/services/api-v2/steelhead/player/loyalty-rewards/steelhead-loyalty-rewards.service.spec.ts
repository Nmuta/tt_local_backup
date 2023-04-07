import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadLoyaltyRewardsService } from './steelhead-loyalty-rewards.service';

describe('SteelheadLoyaltyRewardsService', () => {
  let service: SteelheadLoyaltyRewardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadLoyaltyRewardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
