import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { WoodstockUgcReportService } from './woodstock-ugc-report.service';

/** Defines the mock for the API Service. */
export class MockWoodstockUgcReportService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getUgcReportReasons$ = jasmine
    .createSpy('getUgcReportReasons$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public reportUgc$ = jasmine
    .createSpy('reportUgc$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Ugc Report Service. */
export function createMockWoodstockUgcReportService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: WoodstockUgcReportService,
    useValue: new MockWoodstockUgcReportService(returnValueGenerator),
  };
}
