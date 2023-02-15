import { Provider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadDeeplinkTileService } from './steelhead-deeplink-tiles.service';

/** Defines the mock for the API Service. */
export class MockSteelheadDeeplinkTileService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getDeeplinkTiles$ = jasmine
    .createSpy('getDeeplinkTiles$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));

  public getDeeplinkTile$ = jasmine
    .createSpy('getDeeplinkTile$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));

  public submitDeeplinkTileModification$ = jasmine
    .createSpy('submitDeeplinkTileModification$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));
}

/** Creates an injectable mock for Woodstock Service. */
export function createMockSteelheadDeeplinkTileService(): Provider {
  return {
    provide: SteelheadDeeplinkTileService,
    useValue: new MockSteelheadDeeplinkTileService(),
  };
}
