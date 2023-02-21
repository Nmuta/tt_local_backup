import { ValueProvider } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WoodstockPlayFabBuildsService } from './woodstock-playfab-builds.service';

/** Defines the mock for the Woodstock PlayFab Builds API Service. */
export class MockWoodstockPlayFabBuildsService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock PlayFab Builds Service. */
export function createMockWoodstockPlayFabBuildsService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: WoodstockPlayFabBuildsService,
    useValue: new MockWoodstockPlayFabBuildsService(returnValueGenerator),
  };
}
