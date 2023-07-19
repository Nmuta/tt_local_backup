import { Injectable } from '@angular/core';

// TODO: This seems to already exist in ClipboardModule
/** Helper that sets text to the client's clipboard. */
@Injectable({
  providedIn: 'root',
})
export class Clipboard {
  constructor() {
    // Empty
  }

  /** Copies the provided value to the client clipboard. */
  public copyMessage(val: string): void {
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
