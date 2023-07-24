import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { WoodstockUgcEditService } from './woodstock-ugc-edit.service';

/** Defines the mock for the API Service. */
export class MockWoodstockUgcEditService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public editUgc$ = jasmine
    .createSpy('editUgc$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Ugc Edit Service. */
export function createMockWoodstockUgcEditService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: WoodstockUgcEditService,
    useValue: new MockWoodstockUgcEditService(returnValueGenerator),
  };
}
