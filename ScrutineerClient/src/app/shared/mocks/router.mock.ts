import { Router } from '@angular/router';

/** Defines the router mock. */
export class MockRouter {
    navigate = jasmine.createSpy('navigate');
    get url() {
        return jasmine.createSpy('url');
    }
}
export function createMockRouter() {
    return { provide: Router, useValue: new MockRouter() };
}
