import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcType } from '@models/ugc-filters';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { DateValidators } from '@shared/validators/date-validators';
import { cloneDeep } from 'lodash';
import { DateTime } from 'luxon';
import { EMPTY, Observable } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { SunriseFeatureUgcModalComponent } from './sunrise/sunrise-feature-ugc-modal.component';
import { WoodstockFeatureUgcModalComponent } from './woodstock/woodstock-feature-ugc-modal.component';
import { SteelheadFeatureUgcModalComponent } from './steelhead/steelhead-feature-ugc-modal.component';

export type FeatureUgcModalComponentUnion =
  | SunriseFeatureUgcModalComponent
  | WoodstockFeatureUgcModalComponent
  | SteelheadFeatureUgcModalComponent;

/** Base modal component to set featured status of a UGC item. */
@Component({
  template: '',
  providers: [],
})
export abstract class FeatureUgcModalBaseComponent extends BaseComponent {
  public formControls = {
    isFeatured: new FormControl(''),
    featuredDate: new FormControl('', [DateValidators.isAfter(DateTime.local())]),
  };
  public formGroup = new FormGroup(this.formControls);
  public postMonitor = new ActionMonitor('POST Set Featured Status');
  public ugcItem: PlayerUgcItem;

  public supportedTypes = [
    UgcType.Livery,
    UgcType.Photo,
    UgcType.Tune,
    UgcType.EventBlueprint,
    UgcType.CommunityChallenge,
  ];

  public featureUgcPermAttribute = PermAttributeName.FeatureUgc;

  public abstract gameTitle: GameTitle;

  constructor(
    protected dialogRef: MatDialogRef<FeatureUgcModalComponentUnion>,
    @Inject(MAT_DIALOG_DATA) protected data: PlayerUgcItem,
  ) {
    super();

    this.ugcItem = cloneDeep(data);

    const isUnsupportedType = !this.supportedTypes.includes(data.type);

    if (isUnsupportedType) {
      dialogRef.close();
      throw new Error(
        `Bad UGC Type: ${
          data.type
        }. Featuring UGC content is limited to types: ${this.supportedTypes.join(', ')}.`,
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

    this.formControls.isFeatured.setValue(data.featuredByT10);
    this.changedFeatureStatus();
  }

  public abstract changeFeaturedStatus$(
    itemId: string,
    isFeatured: boolean,
    expireDate?: DateTime,
  ): Observable<void>;

  public abstract getUgcItem$(itemId: string, type: UgcType): Observable<PlayerUgcItem>;

  /** Sets featured status. */
  public setUgcfeatureStatus(): void {
    if (!this.formGroup.valid) {
      return;
    }

    const changeFeaturedStatus$ = this.changeFeaturedStatus$(
      this.ugcItem.id,
      this.formControls.isFeatured.value,
      this.formControls.featuredDate.value,
    );
    this.postMonitor = this.postMonitor.repeat();
    this.dialogRef.disableClose = true;

    changeFeaturedStatus$
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

  /** Logic when changing the feature status checbox. */
  public changedFeatureStatus(): void {
    this.formControls.featuredDate.setValue(null);
  }
}
