import { Router } from '@angular/router';

export class MockRouter {
    navigate = jasmine.createSpy('navigate');
    get url() {
        return jasmine.createSpy('url');
    }
}
export function createMockRouter() {
    return { provide: Router, useValue: new MockRouter() };
}
