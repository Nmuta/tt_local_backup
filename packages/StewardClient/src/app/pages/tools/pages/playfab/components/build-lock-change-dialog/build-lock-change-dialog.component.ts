import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import { PlayFabBuildLock, PlayFabBuildSummary } from '@models/playfab';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { catchError, EMPTY, Observable, takeUntil } from 'rxjs';

/** Data contract for BuildLockChangeDialogComponent.*/
export interface BuildLockChangeDialogData {
  gameTitle: GameTitle;
  build: PlayFabBuildSummary;
  lockBuild: boolean;
  lockAction$: (buildId: GuidLikeString, lockReason: string) => Observable<PlayFabBuildLock>;
  unlockAction$: (buildId: GuidLikeString) => Observable<PlayFabBuildLock>;
}

/**
 *  Requires adding a reason to a lock/unlock PlayFab build request.
 */
@Component({
  selector: 'build-lock-change-dialog',
  templateUrl: 'build-lock-change-dialog.component.html',
  styleUrls: ['build-lock-change-dialog.component.scss'],
})
export class BuildLockChangeDialogComponent extends BaseComponent implements OnInit {
  public actionMonitor: ActionMonitor;
  public playFabBuildsPermAttribute = PermAttributeName.ManagePlayFabBuildLocks;
  public formControls = {
    reason: new UntypedFormControl(null),
  };
  public formGroup = new UntypedFormGroup(this.formControls);

  public get dialogTitle(): string {
    return this.data.lockBuild ? `Lock PlayFab Build` : `Unlock PlayFab Build`;
  }

  public get buttonText(): string {
    return this.data.lockBuild ? 'Lock Build' : 'Unock Build';
  }

  public get buttonIcon(): string {
    return this.data.lockBuild ? 'lock' : 'lock_open';
  }

  public get buttonColor(): string {
    return this.data.lockBuild ? 'accent' : 'warn';
  }

  constructor(
    public dialogRef: MatDialogRef<BuildLockChangeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BuildLockChangeDialogData,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (!this.data) {
      throw new Error('No data passed into BuildLockChangeDialogComponent');
    }

    if (this.data.lockBuild) {
      this.formControls.reason.setValidators(Validators.required);
    }

    const actionMonitorMessage = this.data.lockBuild
      ? `Add lock to build ${this.data.build.id}`
      : `Remove lock for build ${this.data.build.id}`;

    this.actionMonitor = new ActionMonitor(actionMonitorMessage);
  }

  /** Sets featured status. */
  public commitAction(): void {
    this.actionMonitor = this.actionMonitor.repeat();
    this.dialogRef.disableClose = true;

    const action$ = this.data.lockBuild
      ? this.data.lockAction$(this.data.build.id, this.formControls.reason.value)
      : this.data.unlockAction$(this.data.build.id);

    action$
      .pipe(
        this.actionMonitor.monitorSingleFire(),
        catchError(() => EMPTY),
        takeUntil(this.onDestroy$),
      )
      .subscribe((lock: PlayFabBuildLock) => {
        this.dialogRef.disableClose = false;

        this.dialogRef.close(this.data.lockBuild ? lock : null);
      });
  }
}
