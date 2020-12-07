import { Injectable, Provider } from '@angular/core';

import { WindowService } from './window.service';

/** A mock child window object. */
export class MockChildWindow {
  public onunload = jasmine.createSpy('onunload');
  public closed = false;
}

/** Defines the mock for the Window Service. */
@Injectable()
export class MockWindowService {
  public location = jasmine.createSpy('location');
  public open = jasmine.createSpy('open').and.returnValue(new MockChildWindow());

  public isInIframe = false;
}

/** Creates an injectable mock for Window Service. */
export function createMockWindowService(): Provider {
  return { provide: WindowService, useValue: new MockWindowService() };
}
