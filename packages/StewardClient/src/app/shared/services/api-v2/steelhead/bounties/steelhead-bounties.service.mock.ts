import { ValueProvider } from '@angular/core';
import { of } from 'rxjs';
import { SteelheadBountiesService } from './steelhead-bounties.service';

/** Defines the mock for the API Service. */
export class MockSteelheadBountiesService {
  public getBountySummaries$ = jasmine.createSpy('getBountySummaries').and.returnValue(of());
  public getBountyDetail$ = jasmine.createSpy('getBountyDetail').and.returnValue(of());
  public getBountyThresholdEntry$ = jasmine
    .createSpy('getBountyThresholdEntry')
    .and.returnValue(of());

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead BBounties Service. */
export function createMockSteelheadBountiesService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadBountiesService,
    useValue: new MockSteelheadBountiesService(returnValueGenerator),
  };
}
