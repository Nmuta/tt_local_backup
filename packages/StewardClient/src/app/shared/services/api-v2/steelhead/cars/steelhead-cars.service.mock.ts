import { ValueProvider } from '@angular/core';
import { of } from 'rxjs';
import { SteelheadCarsService } from './steelhead-cars.service';

/** Defines the mock for the API Service. */
export class MockSteelheadCarsService {
  public getCarManufacturers$ = jasmine.createSpy('getCarManufacturers').and.returnValue(of());

  public getCarsReference$ = jasmine.createSpy('getCarsReference').and.returnValue(of());

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Cars Service. */
export function createMockSteelheadCarsService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadCarsService,
    useValue: new MockSteelheadCarsService(returnValueGenerator),
  };
}
