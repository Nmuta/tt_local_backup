import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { PermissionsService } from './permissions.service';

/** Defines the mock for the Permissions Service. */
export class MockPermissionsService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getAllPermissionAttributes$ = jasmine
    .createSpy('getAllPermissionAttributes$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of({}))));

  public getUserPermissionAttributes$ = jasmine
    .createSpy('getUserPermissionAttributes$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Permissions Service. */
export function createMockPermissionsService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: PermissionsService,
    useValue: new MockPermissionsService(returnValueGenerator),
  };
}
