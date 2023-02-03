import { ValueProvider } from '@angular/core';
import { of } from 'rxjs';
import { SteelheadBuildersCupService } from './steelhead-builders-cup.service';

/** Defines the mock for the API Service. */
export class MockSteelheadBuildersCupService {
  public getBuildersCupScheduleForUser$ = jasmine
    .createSpy('getBuildersCupScheduleForUser')
    .and.returnValue(of({ series: [] }));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Builders Cup Service. */
export function createMockSteelheadBuildersCupService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadBuildersCupService,
    useValue: new MockSteelheadBuildersCupService(returnValueGenerator),
  };
}
