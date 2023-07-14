import { Injectable, Provider } from '@angular/core';
import { MatIconRegistryService } from './mat-icon-registry.service';

/** Defines the mock for the API Service. */
@Injectable()
export class MockMatIconRegistryService {
  public initialize = jasmine.createSpy('initialize');
}

/** Creates an injectable mock for API Service. */
export function createMockMatIconRegistryService(): Provider {
  return {
    provide: MatIconRegistryService,
    useValue: new MockMatIconRegistryService(),
  };
}
