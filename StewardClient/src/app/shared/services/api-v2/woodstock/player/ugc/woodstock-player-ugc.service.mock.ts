import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { WoodstockPlayerUgcService } from './woodstock-player-ugc.service';

/** Defines the mock for the API Service. */
export class MockWoodstockPlayerUgcService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getPlayerUgcByType$ = jasmine
    .createSpy('getPlayerUgcByType$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public getPlayerHiddenUgcByXuid$ = jasmine
    .createSpy('getPlayerHiddenUgcByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Service. */
export function createMockWoodstockPlayerUgcService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: WoodstockPlayerUgcService,
    useValue: new MockWoodstockPlayerUgcService(returnValueGenerator),
  };
}
