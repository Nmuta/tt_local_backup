import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadUgcReportService } from './steelhead-ugc-report.service';

/** Defines the mock for the API Service. */
export class MockSteelheadUgcReportService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public reportUgc$ = jasmine
    .createSpy('reportUgc$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Ugc Report Service. */
export function createMockSteelheadUgcReportService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadUgcReportService,
    useValue: new MockSteelheadUgcReportService(returnValueGenerator),
  };
}
