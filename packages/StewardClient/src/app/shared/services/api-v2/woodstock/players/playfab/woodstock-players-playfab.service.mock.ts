import { Injectable, Provider } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WoodstockPlayersPlayFabService } from './woodstock-players-playfab.service';

/** Defines the mock for the WoodstockPlayersPlayFabService. */
@Injectable()
export class MockWoodstockPlayersPlayFabService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getPlayFabIds$ = jasmine.createSpy('getPlayFabIds$').and.returnValue(of({}));
}
/** Creates an injectable mock for Woodstock Players PlayFab Service. */
export function createMockWoodstockPlayersPlayFabService(): Provider {
  return {
    provide: WoodstockPlayersPlayFabService,
    useValue: new MockWoodstockPlayersPlayFabService(),
  };
}
