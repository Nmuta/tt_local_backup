import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { getUgcDetailsRoute } from '@helpers/route-links';
import { UgcOperationResult } from '@models/player-ugc-item';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';

/** A component that summarizes the results of a ugc operation. */
@Component({
  templateUrl: './ugc-operation-snackbar.component.html',
  styleUrls: ['./ugc-operation-snackbar.component.scss'],
})
export class UgcOperationSnackbarComponent implements OnInit {
  public completionValue: UgcOperationResult;
  public newTabRoute: string[];

  /** Gets the label for the error. */
  public get label(): string {
    return this.monitor.label || 'UNKNOWN';
  }

  constructor(
    private readonly snackBarRef: MatSnackBarRef<UgcOperationSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public monitor: ActionMonitor,
  ) {}

  /** Called when "Dismiss" is clicked. */
  public onDismiss(): void {
    this.snackBarRef.dismiss();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.completionValue = this.monitor.status.value as UgcOperationResult;
    this.newTabRoute = getUgcDetailsRoute(
      this.completionValue.gameTitle,
      this.completionValue.fileId,
    );
  }
}
