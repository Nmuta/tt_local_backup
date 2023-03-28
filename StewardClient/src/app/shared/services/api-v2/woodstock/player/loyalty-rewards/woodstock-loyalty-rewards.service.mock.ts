import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { WoodstockLoyaltyRewardsService } from './woodstock-loyalty-rewards.service';
import { WoodstockLoyaltyRewardsTitle } from '@models/loyalty-rewards';

/** Defines the mock for the API Service. */
export class MockWoodstockLoyaltyRewardsService {
  private result: WoodstockLoyaltyRewardsTitle[] = [WoodstockLoyaltyRewardsTitle.FH1];
  public waitUntil$: Observable<unknown> = of(true);

  public getUserLoyalty$ = jasmine.createSpy('getUserLoyalty').and.returnValue(of(this.result));

  public postUserLoyalty$ = jasmine
    .createSpy('postUserLoyalty$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of())));

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
