import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadPlayerUgcService } from './steelhead-player-ugc.service';

/** Defines the mock for the API Service. */
export class MockSteelheadPlayerUgcService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getPlayerUgcByType$ = jasmine
    .createSpy('getPlayerUgcByType$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Service. */
export function createMockSteelheadPlayerUgcService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadPlayerUgcService,
    useValue: new MockSteelheadPlayerUgcService(returnValueGenerator),
  };
}
