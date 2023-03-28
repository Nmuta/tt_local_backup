import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadLoyaltyRewardsService } from './steelhead-loyalty-rewards.service';
import { SteelheadLoyaltyRewardsTitle } from '@models/loyalty-rewards';

/** Defines the mock for the API Service. */
export class MockSteelheadLoyaltyRewardsService {
  private result: SteelheadLoyaltyRewardsTitle[] = [SteelheadLoyaltyRewardsTitle.FH];
  public waitUntil$: Observable<unknown> = of(true);

  public getUserLoyalty$ = jasmine.createSpy('getUserLoyalty').and.returnValue(of(this.result));

  public postUserLoyalty$ = jasmine
    .createSpy('postUserLoyalty$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of())));

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
