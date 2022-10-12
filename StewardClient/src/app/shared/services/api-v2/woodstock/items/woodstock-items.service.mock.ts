import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { WoodstockItemsService } from './woodstock-items.service';

/** Defines the mock for the API Service. */
export class MockWoodstockItemsService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getMasterInventory$ = jasmine
    .createSpy('getMasterInventory$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Service. */
export function createMockWoodstockItemsService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: WoodstockItemsService,
    useValue: new MockWoodstockItemsService(returnValueGenerator),
  };
}
