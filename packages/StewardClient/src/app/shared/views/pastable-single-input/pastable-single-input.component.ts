import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { renderGuard } from '@helpers/rxjs';

/** A component that allows for a pastable single input and outputs its changes. */
@Component({
  selector: 'pastable-single-input',
  templateUrl: './pastable-single-input.component.html',
  styleUrls: ['./pastable-single-input.component.scss'],
})
export class PastableSingleInputComponent extends BaseComponent implements OnInit {
  /** REVIEW-COMMENT: Defines the mat-input label */
  @Input() public label: string = null;
  /** REVIEW-COMMENT: Sets provided value to input on initial load */
  @Input() public presetValue: string = null;
  /** REVIEW-COMMENT: Output when a string is pasted in the input. */
  @Output() public changes = new EventEmitter<string>();

  public input: string = '';

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (this.presetValue) {
      this.input = this.presetValue;
      this.emitInput();
    }
  }

  /** Emits input. */
  public emitInput(): void {
    const trimmedInput = this.input.trim();
    this.changes.emit(trimmedInput !== '' ? trimmedInput : null);
  }

  /** Sets input to the paste event and emits the change. */
  public pastedInput(): void {
    renderGuard(() => this.emitInput());
  }

  /** Clears input and emits the change. */
  public clearInput(): void {
    this.input = '';
    this.emitInput();
  }
}
