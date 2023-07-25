import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadUgcEditService } from './steelhead-ugc-edit.service';

/** Defines the mock for the API Service. */
export class MockSteelheadUgcEditService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public editUgc$ = jasmine
    .createSpy('editUgc$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Ugc Edit Service. */
export function createMockSteelheadUgcEditService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadUgcEditService,
    useValue: new MockSteelheadUgcEditService(returnValueGenerator),
  };
}
