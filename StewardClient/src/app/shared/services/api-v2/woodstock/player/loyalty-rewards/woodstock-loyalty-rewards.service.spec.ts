import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockLoyaltyRewardsService } from './woodstock-loyalty-rewards.service';

describe('WoodstockLoyaltyRewardsService', () => {
  let service: WoodstockLoyaltyRewardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WoodstockLoyaltyRewardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
