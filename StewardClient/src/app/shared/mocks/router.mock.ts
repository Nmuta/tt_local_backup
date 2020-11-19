/* eslint-disable @typescript-eslint/no-explicit-any */

import { Provider } from '@angular/core';
import { Router } from '@angular/router';

/** Defines the router mock. */
export class MockRouter {
  public navigate = jasmine.createSpy('navigate');
  get url(): string {
    return jasmine.createSpy('url') as any;
  }
}
export function createMockRouter(): Provider {
  return { provide: Router, useValue: new MockRouter() };
}
