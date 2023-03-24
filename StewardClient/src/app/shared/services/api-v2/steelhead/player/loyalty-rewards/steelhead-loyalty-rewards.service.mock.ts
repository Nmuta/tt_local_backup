import { ValueProvider } from '@angular/core';
import { of } from 'rxjs';
import { SteelheadLoyaltyRewardsService } from './steelhead-loyalty-rewards.service';

/** Defines the mock for the API Service. */
export class MockSteelheadLoyaltyRewardsService {
  private result: SteelheadLoyaltyRewardsTitle[] = [SteelheadLoyaltyRewardsTitle.FH];

  public getUserLoyalty$ = jasmine.createSpy('getUserLoyalty').and.returnValue(of(this.result));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Builders Cup Service. */
export function createMockSteelheadLoyaltyRewardsService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadLoyaltyRewardsService,
    useValue: new MockSteelheadLoyaltyRewardsService(returnValueGenerator),
  };
}
