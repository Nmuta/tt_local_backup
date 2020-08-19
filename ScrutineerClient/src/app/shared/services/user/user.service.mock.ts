// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//   Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { Injectable } from '@angular/core';
import { UserService } from '@shared/services/user/user.service';

@Injectable()
export class MockUserService {
    public getUser = jasmine.createSpy('getUser');
}

export function createMockUserService() {
    return { provide: UserService, useValue: new MockUserService() };
}
