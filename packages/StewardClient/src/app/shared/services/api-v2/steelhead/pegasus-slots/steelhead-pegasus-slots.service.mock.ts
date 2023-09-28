import { Provider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadPegasusSlotsService } from './steelhead-pegasus-slots.service';

/** Defines the mock for the API Service. */
export class MockSteelheadPegasusSlotsService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getPegasusSlots$ = jasmine
    .createSpy('getPegasusSlots$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));
}

/** Creates an injectable mock for Steelhead Pegasus Service. */
export function createMockSteelheadPegasusSlotsService(): Provider {
  return {
    provide: SteelheadPegasusSlotsService,
    useValue: new MockSteelheadPegasusSlotsService(),
  };
}
