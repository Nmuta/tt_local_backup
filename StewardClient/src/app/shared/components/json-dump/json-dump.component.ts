import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

/** Displays the value sent on `input` as a json blob. */
@Component({
  selector: 'json-dump',
  templateUrl: './json-dump.component.html',
  styleUrls: ['./json-dump.component.scss'],
})
export class JsonDumpComponent {
  @Input() public input: unknown;
  @Output() public resetStateEvent = new EventEmitter<void>();

  public readonly copyIcon = faCopy;

  /** Emits a reset state event. */
  public emitResetStateEvent(): void {
    this.resetStateEvent.emit();
  }
}
