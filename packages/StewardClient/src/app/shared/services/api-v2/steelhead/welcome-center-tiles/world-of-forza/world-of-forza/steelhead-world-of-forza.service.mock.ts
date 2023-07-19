import { Provider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadWorldOfForzaService } from './steelhead-world-of-forza.service';

/** Defines the mock for the API Service. */
export class MockSteelheadWorldOfForzaService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getDisplayConditions$ = jasmine
    .createSpy('getDisplayConditions$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));
}

/** Creates an injectable mock for Woodstock Service. */
export function createMockSteelheadWorldOfForzaService(): Provider {
  return {
    provide: SteelheadWorldOfForzaService,
    useValue: new MockSteelheadWorldOfForzaService(),
  };
}
