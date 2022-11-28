import { Injectable, Provider } from '@angular/core';
import { PermAttributesService } from './perm-attributes.service';

/** Defines the mock for the PermAttributeService. */
@Injectable()
export class MockPermAttributesService {}

/** Creates an injectable mock for Perm Attribute Service. */
export function createMockPermAttributesService(): Provider {
  return {
    provide: PermAttributesService,
    useValue: new MockPermAttributesService(),
  };
}
