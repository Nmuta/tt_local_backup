import { Provider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadImageTextTileService } from './steelhead-image-text-tiles.service';

/** Defines the mock for the API Service. */
export class MockSteelheadImageTextTileService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getImageTextTiles$ = jasmine
    .createSpy('getImageTextTiles$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));

  public getImageTextTile$ = jasmine
    .createSpy('getImageTextTile$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));

  public submitImageTextTileModification$ = jasmine
    .createSpy('submitImageTextTileModification$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));
}

/** Creates an injectable mock for Woodstock Service. */
export function createMockSteelheadImageTextTileService(): Provider {
  return {
    provide: SteelheadImageTextTileService,
    useValue: new MockSteelheadImageTextTileService(),
  };
}
