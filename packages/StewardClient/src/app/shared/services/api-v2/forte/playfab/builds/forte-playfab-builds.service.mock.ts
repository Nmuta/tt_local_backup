import { ValueProvider } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FortePlayFabBuildsService } from './forte-playfab-builds.service';

/** Defines the mock for the Forte PlayFab Builds API Service. */
export class MockFortePlayFabBuildsService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);
}

/** Creates an injectable mock for Forte PlayFab Builds Service. */
export function createMockFortePlayFabBuildsService(): ValueProvider {
  return {
    provide: FortePlayFabBuildsService,
    useValue: new MockFortePlayFabBuildsService(),
  };
}
