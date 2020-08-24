import { Injectable } from '@angular/core';

import { WindowService } from './window.service';

/** Defines the mock for the Window Service. */
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
