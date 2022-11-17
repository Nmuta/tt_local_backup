import { Injectable, Provider } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OldPermissionsService } from './old-permissions.service';

/** Defines the mock for the Permissions Service. */
@Injectable()
export class MockPermissionsService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public currentUserHasWritePermission = jasmine
    .createSpy('currentUserHasWritePermission')
    .and.returnValue(true);
}
/** Creates an injectable mock for Permissions Service. */
export function createMockPermissionsService(): Provider {
  return {
    provide: OldPermissionsService,
    useValue: new MockPermissionsService(),
  };
}
