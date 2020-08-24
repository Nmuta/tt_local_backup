import { Injectable } from '@angular/core';

/** Defines the clipboard helper */
export class Clipboard {
    constructor() {
        // Empty
    }

    /** Copies the provided value to the client clipboard. */
    public copyMessage(val: string) {
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
      }
}

/** Mocks the clipboard helper. */
@Injectable()
export class MockClipboard {
    public copyMessage = jasmine.createSpy('copyMessage');
}

export function createMockClipboard() {
    return {
        provide: Clipboard,
        useValue: new MockClipboard()
    };
}
