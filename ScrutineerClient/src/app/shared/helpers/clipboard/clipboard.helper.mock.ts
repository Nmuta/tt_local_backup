import { Injectable } from '@angular/core';

import { Clipboard } from './clipboard.helper';

/** Mocks the clipboard helper. */
@Injectable()
export class MockClipboard {
  public copyMessage = jasmine.createSpy('copyMessage');
}

export function createMockClipboard() {
  return {
    provide: Clipboard,
    useValue: new MockClipboard(),
  };
}
