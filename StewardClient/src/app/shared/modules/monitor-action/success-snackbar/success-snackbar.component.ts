import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { ActionMonitor } from '../action-monitor';

/** A component that displays a success in a snackbar. */
@Component({
  templateUrl: './success-snackbar.component.html',
  styleUrls: ['./success-snackbar.component.scss'],
})
export class SuccessSnackbarComponent {
  /** Gets the label for the error. */
  public get label(): string {
    return this.monitor.label || 'UNKNOWN';
  }

  constructor(
    private readonly snackBarRef: MatSnackBarRef<SuccessSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public monitor: ActionMonitor,
  ) {}

  /** Called when "Dismiss" is clicked. */
  public onDismiss(): void {
    this.snackBarRef.dismiss();
  }
}
