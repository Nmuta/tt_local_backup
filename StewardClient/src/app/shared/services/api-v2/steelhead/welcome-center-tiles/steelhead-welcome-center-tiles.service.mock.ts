import { Provider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadWelcomeCenterTileService } from './steelhead-welcome-center-tiles.service';

/** Defines the mock for the API Service. */
export class MockSteelheadWelcomeCenterTileService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getWelcomeCenterTiles$ = jasmine
    .createSpy('getWelcomeCenterTiles$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));

  public getWelcomeCenterTile$ = jasmine
    .createSpy('getWelcomeCenterTile$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));

  public submitModification$ = jasmine
    .createSpy('submitModification$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));
}

/** Creates an injectable mock for Woodstock Service. */
export function createMockSteelheadWelcomeCenterTileService(): Provider {
  return {
    provide: SteelheadWelcomeCenterTileService,
    useValue: new MockSteelheadWelcomeCenterTileService(),
  };
}
