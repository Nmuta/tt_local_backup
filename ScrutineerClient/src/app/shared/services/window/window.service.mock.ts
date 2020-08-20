// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//   Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { Injectable } from '@angular/core';
import { WindowService } from './window.service';

@Injectable()
export class MockWindowService {
    public addEventListener = jasmine.createSpy('oaddEventListenerpen');
    public removeEventListener = jasmine.createSpy('removeEventListener');
    public top = jasmine.createSpy('top');
    public location = jasmine.createSpy('location');
    public open = jasmine.createSpy('open');
    public zafClient = jasmine.createSpy('zafClient');
}

export function createMockWindowService() {
    return { provide: WindowService, useValue: new MockWindowService() };
}
