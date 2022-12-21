import { ValueProvider } from '@angular/core';
import { of } from 'rxjs';
import { SteelheadRacersCupService } from './steelhead-racers-cup.service';

/** Defines the mock for the API Service. */
export class MockSteelheadRacersCupService {
  public getRacersCupScheduleForUser$ = jasmine
    .createSpy('getRacersCupScheduleForUser')
    .and.returnValue(of({ series: [] }));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Racers Cup Service. */
export function createMockSteelheadRacersCupService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadRacersCupService,
    useValue: new MockSteelheadRacersCupService(returnValueGenerator),
  };
}
