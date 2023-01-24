import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { V2UsersService } from './users.service';

/** Defines the mock for the Users API Service. */
export class MockV2UsersService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public syncDb$ = jasmine
    .createSpy('syncDb$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of())));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Users Service. */
export function createMockV2UsersService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: V2UsersService,
    useValue: new MockV2UsersService(returnValueGenerator),
  };
}
