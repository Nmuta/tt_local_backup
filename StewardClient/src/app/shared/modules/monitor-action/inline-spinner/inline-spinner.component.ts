import { Component, Input } from '@angular/core';
import { ActionMonitor } from '../action-monitor';

/** Renders an inline spinner tied to an action monitor. */
@Component({
  selector: 'inline-spinner',
  templateUrl: './inline-spinner.component.html',
  styleUrls: ['./inline-spinner.component.scss'],
})
export class InlineSpinnerComponent {
  @Input() monitor: ActionMonitor;
}
