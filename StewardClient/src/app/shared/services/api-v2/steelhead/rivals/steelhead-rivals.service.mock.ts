import { ValueProvider } from '@angular/core';
import { of } from 'rxjs';
import { SteelheadRivalsService } from './steelhead-rivals.service';

/** Defines the mock for the API Service. */
export class MockSteelheadRivalsService {
  public getRivalsEvents$ = jasmine.createSpy('getRivalsEvents').and.returnValue(of(null));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Rivals Service. */
export function createMockSteelheadRivalsService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadRivalsService,
    useValue: new MockSteelheadRivalsService(returnValueGenerator),
  };
}
