import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitleCodeName } from '@models/enums';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcType } from '@models/ugc-filters';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { DateValidators } from '@shared/validators/date-validators';
import { cloneDeep } from 'lodash';
import { DateTime } from 'luxon';
import { EMPTY, Observable } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { SunriseFeatureUgcModalComponent } from './sunrise/sunrise-feature-ugc-modal.component';
import { WoodstockFeatureUgcModalComponent } from './woodstock/woodstock-feature-ugc-modal.component';

export type FeatureUgcModalComponentUnion =
  | SunriseFeatureUgcModalComponent
  | WoodstockFeatureUgcModalComponent;

/** Base modal component to set featured status of a UGC item. */
@Component({
  template: '',
})
export abstract class FeatureUgcModalBaseComponent extends BaseComponent {
  public formControls = {
    featuredDate: new FormControl('', [
      Validators.required,
      DateValidators.isAfter(DateTime.local()),
    ]),
  };
  public formGroup = new FormGroup(this.formControls);
  public postMonitor = new ActionMonitor('POST Set Featured Status');
  public ugcItem: PlayerUgcItem;

  public abstract gameTitle: GameTitleCodeName;

  constructor(
    protected dialogRef: MatDialogRef<FeatureUgcModalComponentUnion>,
    @Inject(MAT_DIALOG_DATA) protected data: PlayerUgcItem,
  ) {
    super();

    this.ugcItem = cloneDeep(data);

    const isUnsupportedType =
      data.type !== UgcType.Livery && data.type !== UgcType.Photo && data.type !== UgcType.Tune;
    if (isUnsupportedType) {
      dialogRef.close();
      throw new Error(
        `Bad UGC Type: ${data.type}. Featuring UGC content is limited to types: ${UgcType.Livery}, ${UgcType.Photo}, ${UgcType.Tune}.`,
      );
    }

    if (!data.isPublic) {
      dialogRef.close();
      throw new Error(
        `Cannot feature private UGC. Featuring UGC content is limited to public content only, content with id ${data.id} is private.`,
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

  public abstract getUgcItem$(itemId: string, type: UgcType): Observable<PlayerUgcItem>;

  /** Sets featured status. */
  public featureUgc(): void {
    if (!this.formGroup.valid) {
      return;
    }

    const setFeaturedStatus$ = this.setFeaturedStatus$(
      this.ugcItem.id,
      this.formControls.featuredDate.value,
    );
    this.postMonitor = this.postMonitor.repeat();
    this.dialogRef.disableClose = true;

    setFeaturedStatus$
      .pipe(
        this.postMonitor.monitorSingleFire(),
        catchError(() => EMPTY),
        switchMap(() => {
          return this.getUgcItem$(this.ugcItem.id, this.ugcItem.type);
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe((ugcItem: PlayerUgcItem) => {
        this.dialogRef.disableClose = false;
        this.ugcItem = ugcItem;
      });
  }

  /** Deletes featured status. */
  public deleteFeatureUgcStatus(): void {
    if (!this.ugcItem.featuredByT10) {
      return;
    }

    const deleteFeaturedStatus$ = this.deleteFeaturedStatus$(this.ugcItem.id);
    this.postMonitor = this.postMonitor.repeat();
    this.dialogRef.disableClose = true;

    deleteFeaturedStatus$
      .pipe(
        this.postMonitor.monitorSingleFire(),
        catchError(() => EMPTY),
        switchMap(() => {
          return this.getUgcItem$(this.ugcItem.id, this.ugcItem.type);
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe((ugcItem: PlayerUgcItem) => {
        this.dialogRef.disableClose = false;
        this.ugcItem = ugcItem;
      });
  }
}
