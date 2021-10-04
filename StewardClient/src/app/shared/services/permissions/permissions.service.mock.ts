import { Injectable, Provider } from '@angular/core';
import { PermissionsService } from './permissions.service';

/** Defines the mock for the API Service. */
@Injectable()
export class MockPermissionsService {}
/** Creates an injectable mock for Settings Service. */
export function createMockPermissionsService(): Provider {
  return {
    provide: PermissionsService,
    useValue: new MockPermissionsService(),
  };
}
