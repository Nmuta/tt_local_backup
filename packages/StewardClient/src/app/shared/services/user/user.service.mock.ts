import { Injectable, Provider } from '@angular/core';
import { UserService } from '@shared/services/user/user.service';
import { of } from 'rxjs';

/** Defines the mock for the User Service. */
@Injectable()
export class MockUserService {
  public getUserProfile$ = jasmine.createSpy('getUserProfile').and.returnValue(of(null));
  public getStewardUsers$ = jasmine.createSpy('getStewardUsers').and.returnValue(of([]));
  public getAllStewardUsers$ = jasmine.createSpy('getAllStewardUsers').and.returnValue(of([]));
}

/** Creates an injectable mock for User Service. */
export function createMockUserService(): Provider {
  return { provide: UserService, useValue: new MockUserService() };
}
