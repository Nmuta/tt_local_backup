import { Provider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadPegasusService } from './steelhead-pegasus.service';

/** Defines the mock for the API Service. */
export class MockSteelheadPegasusService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getDatetimeRanges$ = jasmine
    .createSpy('getDatetimeRanges$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));

  public getChallenges$ = jasmine
    .createSpy('getChallenges$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));
}

/** Creates an injectable mock for Steelhead Pegasus Service. */
export function createMockSteelheadPegasusService(): Provider {
  return {
    provide: SteelheadPegasusService,
    useValue: new MockSteelheadPegasusService(),
  };
}
