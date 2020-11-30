/* eslint-disable @typescript-eslint/no-explicit-any */

import { Provider } from '@angular/core';
import { Router } from '@angular/router';

/** Defines the router mock. */
export class MockRouter {
  public navigate = jasmine.createSpy('navigate');
}
/** Creates an injectable mock for Zendesk Service.
 * @deprecated Use RouterTestingModule and store.dispatch(Navigate)
 */
export function createMockRouter(): Provider {
  return { provide: Router, useValue: new MockRouter() };
}
