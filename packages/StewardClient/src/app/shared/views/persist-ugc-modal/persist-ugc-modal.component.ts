import { Component, Input } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { PersistedItemResult, PlayerUgcItem, UgcOperationResult } from '@models/player-ugc-item';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { UgcOperationSnackbarComponent } from '@tools-app/pages/ugc-details/components/ugc-action-snackbar/ugc-operation-snackbar.component';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

/** Service contract for persisting UGC. */
export interface PersistUgcService {
  title: GameTitle;
  persistUgc$: (
    itemId: string,
    title: string,
    description: string,
  ) => Observable<PersistedItemResult>;
}

/** Base component to persist a UGC item. */
@Component({
  selector: 'persist-ugc-modal',
  templateUrl: './persist-ugc-modal.component.html',
  styleUrls: ['./persist-ugc-modal.component.scss'],
})
export class PersistUgcModalComponent extends BaseComponent {
  /** Service used to persist UGC. */
  @Input() service: PersistUgcService;

  /** UGC item to persist. */
  @Input() ugcItem: PlayerUgcItem;

  public formControls = {
    title: new UntypedFormControl(null, Validators.maxLength(32)),
    description: new UntypedFormControl(null, Validators.maxLength(128)),
  };
  public formGroup = new UntypedFormGroup(this.formControls);
  public postMonitor = new ActionMonitor('POST Persist UGC');
  public persistUgcPermAttribute = PermAttributeName.PersistUgc;

  public ugcOperationSnackbarComponent = UgcOperationSnackbarComponent;

  constructor(protected dialogRef: MatDialogRef<PersistUgcModalComponent>) {
    super();
  }

  /** Persist the UGC item. */
  public persistUgc(): void {
    if (!this.formGroup.valid) {
      return;
    }

    this.postMonitor = this.postMonitor.repeat();
    this.dialogRef.disableClose = true;

    this.service
      .persistUgc$(
        this.ugcItem.id,
        this.formControls.title.value,
        this.formControls.description.value,
      )
      .pipe(
        // The custom success snackbar expects a UgcOperationResult as the monitor value
        // Mapping must be done above the monitor single fire for it to use mapped result
        map(
          result =>
            ({
              gameTitle: GameTitle.FH5,
              fileId: result.newFileId,
              allowOpenInNewTab: true,
            } as UgcOperationResult),
        ),
        this.postMonitor.monitorSingleFire(),
        catchError(() => EMPTY),
        takeUntil(this.onDestroy$),
      )
      .subscribe(_ => (this.dialogRef.disableClose = false));
  }
}
