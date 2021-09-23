import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/** A component that allows for a pastable single input and outputs its changes. */
@Component({
  selector: 'pastable-single-input',
  templateUrl: './pastable-single-input.component.html',
  styleUrls: ['./pastable-single-input.component.scss'],
})
export class PastableSingleInputComponent extends BaseComponent {
  @Input() public label: string = null;
  @Output() public changes = new EventEmitter<string>();

  public input: string = '';

  /** Emits input. */
  public emitInput(): void {
    const trimmedInput = this.input.trim();
    this.changes.emit(trimmedInput !== '' ? trimmedInput : null);
  }

  /** Sets input to the paste event and emits the change. */
  public pastedInput(): void {
    // 1ms delay is required so emit can be processed AFTER the input value is changed.
    timer(1)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.emitInput();
      });
  }

  /** Clears input and emits the change. */
  public clearInput(): void {
    this.input = '';
    this.emitInput();
  }
}
