import { Injectable, Provider } from '@angular/core';

import { Clipboard } from './clipboard.helper';

/** Mocks the clipboard helper. */
@Injectable()
export class MockClipboard {
  public copyMessage = jasmine.createSpy('copyMessage');
}

/** Creates an injectable mock for the Clipboard. */
export function createMockClipboard(): Provider {
  return {
    provide: Clipboard,
    useValue: new MockClipboard(),
  };
}
