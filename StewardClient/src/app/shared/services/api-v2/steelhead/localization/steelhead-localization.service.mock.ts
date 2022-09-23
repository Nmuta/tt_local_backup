import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadItemsService } from './steelhead-items.service';

/** Defines the mock for the API Service. */
export class MockSteelheadItemsService {
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
export function createMockSteelheadItemsService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadItemsService,
    useValue: new MockSteelheadItemsService(returnValueGenerator),
  };
}
