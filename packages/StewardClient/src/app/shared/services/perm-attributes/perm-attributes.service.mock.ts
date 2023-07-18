import { Injectable, Provider } from '@angular/core';
import { PermAttributesService } from './perm-attributes.service';
import { of } from 'rxjs';

/** Defines the mock for the PermAttributeService. */
@Injectable()
export class MockPermAttributesService {
  public initializationGuard$ = of();
  public hasFeaturePermission = jasmine.createSpy('hasFeaturePermission').and.returnValue(true);
}
/** Creates an injectable mock for Perm Attribute Service. */
export function createMockPermAttributesService(): Provider {
  return {
    provide: PermAttributesService,
    useValue: new MockPermAttributesService(),
  };
}
