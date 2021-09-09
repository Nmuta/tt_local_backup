import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitleCodeName } from '@models/enums';
import { PlayerUGCItem } from '@models/player-ugc-item';
import { UGCType } from '@models/ugc-filters';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { DateValidators } from '@shared/validators/date-validators';
import { cloneDeep } from 'lodash';
import { DateTime } from 'luxon';
import { EMPTY, Observable } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { SunriseFeatureUGCModalComponent } from './sunrise/sunrise-feature-ugc-modal.component';
import { WoodstockFeatureUGCModalComponent } from './woodstock/woodstock-feature-ugc-modal.component';

export type FeatureUGCModalComponentUnion =
  | SunriseFeatureUGCModalComponent
  | WoodstockFeatureUGCModalComponent;

/** Base modal component to set featured status of a UGC item. */
@Component({
  template: '',
})
export abstract class FeatureUGCModalBaseComponent extends BaseComponent {
  public formControls = {
    featuredDate: new FormControl('', [
      Validators.required,
      DateValidators.isAfter(DateTime.local()),
    ]),
  };
  public formGroup = new FormGroup(this.formControls);
  public postMonitor = new ActionMonitor('POST Set Featured Status');
  public ugcItem: PlayerUGCItem;

  public abstract gameTitle: GameTitleCodeName;

  constructor(
    protected dialogRef: MatDialogRef<FeatureUGCModalComponentUnion>,
    @Inject(MAT_DIALOG_DATA) protected data: PlayerUGCItem,
  ) {
    super();

    this.ugcItem = cloneDeep(data);

    if (data.type !== UGCType.Livery && data.type !== UGCType.Photo) {
      throw new Error(
        `Bad UGC Type: ${data.type}. Featuring UGC content is limited to types: ${UGCType.Livery}, ${UGCType.Photo}.`,
      );
    }

    dialogRef
      .beforeClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => dialogRef.close(this.ugcItem));

    if (data.featuredByT10) {
      this.formControls.featuredDate.setValue(data.featuredEndDateUtc);
    }
  }

  public abstract setFeaturedStatus$(itemId: string, expireDate: DateTime): Observable<void>;
  public abstract deleteFeaturedStatus$(itemId: string): Observable<void>;

  public abstract getUGCItem$(itemId: string, type: UGCType): Observable<PlayerUGCItem>;

  /** Sets featured status. */
  public featureUGC(): void {
    if (!this.formGroup.valid) {
      return;
    }

    const setFeaturedStatus$ = this.setFeaturedStatus$(
      this.ugcItem.guidId,
      this.formControls.featuredDate.value,
    );
    this.postMonitor = new ActionMonitor(this.postMonitor.dispose().label);
    this.dialogRef.disableClose = true;

    setFeaturedStatus$
      .pipe(
        this.postMonitor.monitorSingleFire(),
        catchError(() => EMPTY),
        switchMap(() => {
          return this.getUGCItem$(this.ugcItem.guidId, this.ugcItem.type);
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe((ugcItem: PlayerUGCItem) => {
        this.dialogRef.disableClose = false;
        this.ugcItem = ugcItem;
      });
  }

  /** Deletes featured status. */
  public deleteFeatureUGCStatus(): void {
    if (!this.ugcItem.featuredByT10) {
      return;
    }

    const deleteFeaturedStatus$ = this.deleteFeaturedStatus$(this.ugcItem.guidId);
    this.postMonitor = new ActionMonitor(this.postMonitor.dispose().label);
    this.dialogRef.disableClose = true;

    deleteFeaturedStatus$
      .pipe(
        this.postMonitor.monitorSingleFire(),
        catchError(() => EMPTY),
        switchMap(() => {
          return this.getUGCItem$(this.ugcItem.guidId, this.ugcItem.type);
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe((ugcItem: PlayerUGCItem) => {
        this.dialogRef.disableClose = false;
        this.ugcItem = ugcItem;
      });
  }
}
