import { ValueProvider } from '@angular/core';
import { of } from 'rxjs';
import { SteelheadStoreService } from './steelhead-store.service';

/** Defines the mock for the API Service. */
export class MockSteelheadStoreService {
  public getStoreEntitlements$ = jasmine.createSpy('getStoreEntitlements').and.returnValue(of());

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Store Service. */
export function createMockSteelheadStoreService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadStoreService,
    useValue: new MockSteelheadStoreService(returnValueGenerator),
  };
}
