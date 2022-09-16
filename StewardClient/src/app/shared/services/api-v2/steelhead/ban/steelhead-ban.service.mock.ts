import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadBanService } from './steelhead-ban.service';

/** Defines the mock for the API Service. */
export class MockSteelheadBanService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public expireBan$ = jasmine
    .createSpy('expireBan$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public deleteBan$ = jasmine
    .createSpy('deleteBan$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Service. */
export function createMockSteelheadBanService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadBanService,
    useValue: new MockSteelheadBanService(returnValueGenerator),
  };
}
