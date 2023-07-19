import { Provider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadGenericPopupTileService } from './steelhead-generic-popup-tiles.service';

/** Defines the mock for the API Service. */
export class MockSteelheadGenericPopupTileService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getGenericPopupTiles$ = jasmine
    .createSpy('getGenericPopupTiles$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));

  public getGenericPopupTile$ = jasmine
    .createSpy('getGenericPopupTile$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));

  public submitGenericPopupTileModification$ = jasmine
    .createSpy('submitGenericPopupTileModification$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));
}

/** Creates an injectable mock for Woodstock Service. */
export function createMockSteelheadGenericPopupTileService(): Provider {
  return {
    provide: SteelheadGenericPopupTileService,
    useValue: new MockSteelheadGenericPopupTileService(),
  };
}
