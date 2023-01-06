import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadInventoryService } from './steelhead-inventory.service';

/** Defines the mock for the API Service. */
export class MockSteelheadInventoryService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getInventoryByProfileId$ = jasmine
    .createSpy('getInventoryByProfileId$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Inventory Service. */
export function createMockSteelheadInventoryService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadInventoryService,
    useValue: new MockSteelheadInventoryService(returnValueGenerator),
  };
}
