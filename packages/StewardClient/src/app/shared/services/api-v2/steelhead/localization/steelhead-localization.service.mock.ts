import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadLocalizationService } from './steelhead-localization.service';

/** Defines the mock for the API Service. */
export class MockSteelheadLocalizationService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getMasterInventory$ = jasmine
    .createSpy('getMasterInventory$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));

  public getDetailedCars$ = jasmine
    .createSpy('getDetailedCars$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Service. */
export function createMockSteelheadLocalizationService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadLocalizationService,
    useValue: new MockSteelheadLocalizationService(returnValueGenerator),
  };
}
