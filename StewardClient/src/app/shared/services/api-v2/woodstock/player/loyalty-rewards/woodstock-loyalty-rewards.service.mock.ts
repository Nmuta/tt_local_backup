import { ValueProvider } from '@angular/core';
import { of } from 'rxjs';
import { WoodstockLoyaltyRewardsService } from './woodstock-loyalty-rewards.service';
import { WoodstockLoyaltyRewardsTitle } from '@models/loyalty-rewards';

/** Defines the mock for the API Service. */
export class MockWoodstockLoyaltyRewardsService {
  private result: WoodstockLoyaltyRewardsTitle[] = [WoodstockLoyaltyRewardsTitle.FH1];

  public getUserLoyalty$ = jasmine.createSpy('getUserLoyalty').and.returnValue(of(this.result));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Builders Cup Service. */
export function createMockWoodstockLoyaltyRewardsService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: WoodstockLoyaltyRewardsService,
    useValue: new MockWoodstockLoyaltyRewardsService(returnValueGenerator),
  };
}
