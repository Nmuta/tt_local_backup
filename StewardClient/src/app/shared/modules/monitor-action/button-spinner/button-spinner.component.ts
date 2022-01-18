import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActionMonitor } from '../action-monitor';
import { ErrorSnackbarComponent } from '../error-snackbar/error-snackbar.component';

/**
 * A spinner/icon/empty-space combo designed to be placed inside a button tracking an action monitor.
 * Avoids reflow (with empty-space or icon) when the monitor is inactive.
 * Displays an error icon + tooltip when the monitor is errored.
 */
@Component({
  selector: 'button-spinner',
  templateUrl: './button-spinner.component.html',
  styleUrls: ['./button-spinner.component.scss'],
})
export class ButtonSpinnerComponent {
  /** An angular-material icon to display instead of a blank space. Displayed when the monitor is inactive. */
  @Input() defaultIcon: string;
  /** An angular-material icon to display instead of a success check. Displayed when the monitor has succeeded. */
  @Input() successIcon: string;
  /** An angular-material icon to display instead of a error triangle. Displayed when the monitor has failed. */
  @Input() errorIcon: string;

  /** Which monitor to track. */
  @Input() monitor: ActionMonitor;

  constructor(private readonly snackBar: MatSnackBar) {}

  /** Fired when the error icon is clicked. */
  public onErrorClick(): void {
    this.snackBar.openFromComponent(ErrorSnackbarComponent, {
      data: this.monitor,
      panelClass: ['snackbar-warn'],
    });
  }
}
