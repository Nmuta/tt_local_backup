import { Component, EventEmitter, Output } from '@angular/core';
import { of } from 'rxjs';
import { delay, take } from 'rxjs/operators';

/** A component that gives an input for a share code. */
@Component({
  selector: 'share-code-input',
  templateUrl: './share-code-input.component.html',
  styleUrls: ['./share-code-input.component.scss'],
})
export class ShareCodeInputComponent {
  @Output() public changes = new EventEmitter<string>();

  public shareCodeInput: string = '';

  /** Emits the share code input. */
  public emitShareCodeInput(): void {
    const trimmedShareCode = this.shareCodeInput.trim();
    this.changes.emit(trimmedShareCode !== '' ? trimmedShareCode : null);
  }

  /** Sets the share code to the paste event and emits the change. */
  public pastedShareCode(): void {
    // 1ms delay is required so emit can be processed AFTER the input value is changed.
    of(true)
      .pipe(take(1), delay(1))
      .subscribe(() => {
        this.emitShareCodeInput();
      });
  }

  /** Clears the share code input and emits the change. */
  public clearShareCodeInput(): void {
    this.shareCodeInput = '';
    this.emitShareCodeInput();
  }
}
