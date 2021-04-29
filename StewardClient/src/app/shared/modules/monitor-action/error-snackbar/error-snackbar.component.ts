import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { ActionMonitor } from '../action-monitor';

/** A component that displays an error in a snackbar. */
@Component({
  selector: 'app-error-snackbar',
  templateUrl: './error-snackbar.component.html',
  styleUrls: ['./error-snackbar.component.scss'],
})
export class ErrorSnackbarComponent {
  /** Gets the label for the error. */
  public get label(): string {
    return this.monitor.label || 'UNKNOWN';
  }

  constructor(
    private readonly snackBarRef: MatSnackBarRef<ErrorSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public monitor: ActionMonitor,
  ) {}

  /** Called when "Dismiss" is clicked. */
  public onDismiss(): void {
    this.snackBarRef.dismiss();
  }
}
