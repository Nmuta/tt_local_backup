import { ValueProvider } from '@angular/core';
import { SteelheadPlayerInventoryFakeApi } from '@interceptors/fake-api/apis/v2/steelhead/player/xuid/inventory';
import { SteelheadPlayerInventoryProfilesFakeApi } from '@interceptors/fake-api/apis/v2/steelhead/player/xuid/profiles';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadPlayerInventoryService } from './steelhead-player-inventory.service';

/** Defines the mock for the API Service. */
export class MockSteelheadPlayerInventoryService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getInventoryByXuid$ = jasmine
    .createSpy('getInventoryByXuid$')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(SteelheadPlayerInventoryFakeApi.make()))),
    );

  public getInventoryProfilesByXuid$ = jasmine
    .createSpy('getInventoryProfilesByXuid$')
    .and.callFake(() =>
      this.waitUntil$.pipe(switchMap(() => of(SteelheadPlayerInventoryProfilesFakeApi.make()))),
    );

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Player Inventory Service. */
export function createMockSteelheadPlayerInventoryService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadPlayerInventoryService,
    useValue: new MockSteelheadPlayerInventoryService(returnValueGenerator),
  };
}
