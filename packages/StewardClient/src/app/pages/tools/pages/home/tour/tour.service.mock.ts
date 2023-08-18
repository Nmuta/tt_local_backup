import { Injectable, Provider } from '@angular/core';
import { of } from 'rxjs';
import { UserTourService } from './tour.service';

/** Defines the mock for the UserTourService. */
@Injectable()
export class MockUserTourService {
  public initializationGuard$ = of();
}
/** Creates an injectable mock for User Tour Service. */
export function createMockUserTourService(): Provider {
  return {
    provide: UserTourService,
    useValue: new MockUserTourService(),
  };
}