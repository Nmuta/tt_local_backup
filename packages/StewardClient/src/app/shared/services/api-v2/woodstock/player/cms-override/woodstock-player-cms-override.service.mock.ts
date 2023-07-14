import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { WoodstockPlayerCmsOverrideService } from './woodstock-player-cms-override.service';

/** Defines the mock for the API Service. */
export class MockWoodstockPlayerCmsOverrideService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getCmsOverrideByXuid$ = jasmine
    .createSpy('getCmsOverrideByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of())));

  public setCmsOverrideByXuid$ = jasmine
    .createSpy('setCmsOverrideByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of())));

  public deleteCmsOverrideByXuid$ = jasmine
    .createSpy('deleteCmsOverrideByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of())));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Service. */
export function createMockWoodstockPlayerCmsOverrideService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: WoodstockPlayerCmsOverrideService,
    useValue: new MockWoodstockPlayerCmsOverrideService(returnValueGenerator),
  };
}
