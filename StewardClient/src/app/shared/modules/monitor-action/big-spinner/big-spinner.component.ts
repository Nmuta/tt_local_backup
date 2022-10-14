import { Component, Input } from '@angular/core';
import { ActionMonitor } from '../action-monitor';

/** Renders a large spinner tied to an action monitor. */
@Component({
  selector: 'big-spinner',
  templateUrl: './big-spinner.component.html',
  styleUrls: ['./big-spinner.component.scss'],
})
export class BigSpinnerComponent {
  /** REVIEW-COMMENT: ActionMonitor that decide whether the spinner is shown. */
  @Input() monitor: ActionMonitor;
}
