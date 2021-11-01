import { Component, Input } from '@angular/core';
import { ActionMonitor } from '../action-monitor';

/** Renders a large spinner tied to an action monitor. */
@Component({
  selector: 'big-spinner',
  templateUrl: './big-spinner.component.html',
  styleUrls: ['./big-spinner.component.scss'],
})
export class BigSpinnerComponent {
  @Input() monitor: ActionMonitor;
}
