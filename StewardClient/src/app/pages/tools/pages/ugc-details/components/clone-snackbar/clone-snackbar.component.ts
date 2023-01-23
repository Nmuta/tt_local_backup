import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { ClonedItemResult } from '@models/player-ugc-item';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';

/** A component that summarizes the results of a clone operation. */
@Component({
  templateUrl: './clone-snackbar.component.html',
  styleUrls: ['./clone-snackbar.component.scss'],
})
export class CloneSnackbarComponent implements OnInit {
  public completionValue: ClonedItemResult;

  /** Gets the label for the error. */
  public get label(): string {
    return this.monitor.label || 'UNKNOWN';
  }

  constructor(
    private readonly snackBarRef: MatSnackBarRef<CloneSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public monitor: ActionMonitor,
  ) {}

  /** Called when "Dismiss" is clicked. */
  public onDismiss(): void {
    this.snackBarRef.dismiss();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.completionValue = this.monitor.status.value as ClonedItemResult;
  }
}
