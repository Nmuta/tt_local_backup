import { Injectable, Provider } from '@angular/core';
import { UserService } from '@shared/services/user/user.service';

/** Defines the mock for the User Service. */
@Injectable()
export class MockUserService {
  public getUser = jasmine.createSpy('getUser');
}

export function createMockUserService(): Provider {
  return { provide: UserService, useValue: new MockUserService() };
}
