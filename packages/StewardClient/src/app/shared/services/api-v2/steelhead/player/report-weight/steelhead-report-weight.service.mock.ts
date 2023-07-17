import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadPlayerReportWeightService } from './steelhead-report-weight.service';

/** Defines the mock for the API Service. */
export class MockSteelheadPlayerReportWeightService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getUserReportWeight$ = jasmine
    .createSpy('getUserReportWeight$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public setUserReportWeight$ = jasmine
    .createSpy('setUserReportWeight$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Service. */
export function createMockSteelheadPlayerReportWeightService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadPlayerReportWeightService,
    useValue: new MockSteelheadPlayerReportWeightService(returnValueGenerator),
  };
}
