import { Component, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '@components/base-component/base.component';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { Observable } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { SteelheadEditCarItemModalComponent } from './steelhead/steelhead-edit-car-item-modal.component';
import { GameTitle } from '@models/enums';
import { PlayerInventoryCarItem } from '@models/player-inventory-item';
import BigNumber from 'bignumber.js';
import { GuidLikeString } from '@models/extended-types';
import { SteelheadPlayerInventory } from '@models/steelhead';
import { cloneDeep } from 'lodash';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';

/** Edit car item modal data to be passed in. */
export interface EditCarItemModalData {
  xuid: BigNumber;
  profileId: BigNumber;
  externalProfileId: GuidLikeString;
  car: PlayerInventoryCarItem;
}

type EditCarItemModalComponentUnion = SteelheadEditCarItemModalComponent;

/** Base modal component to set featured status of a UGC item. */
@Component({
  template: '',
  providers: [],
})
export abstract class EditCarItemModalBaseComponent extends BaseComponent {
  // We have the ability to also edit clientCarInfo, entitlementId, & tiersAchieved for a car
  // But have not implemented it yet
  public formControls = {
    versionedLiveryId: new UntypedFormControl(null, Validators.required),
    versionedTuneId: new UntypedFormControl(null, Validators.required),
    experiencePoints: new UntypedFormControl(null, [Validators.required, Validators.min(0)]),
    flags: new UntypedFormControl(null, Validators.required),
    purchasePrice: new UntypedFormControl(null, [Validators.required, Validators.min(0)]),
  };
  public formGroup = new UntypedFormGroup(this.formControls);
  public postMonitor = new ActionMonitor('Save car data');
  public carItem: PlayerInventoryCarItem;

  public editCardPermission = PermAttributeName.ManagePlayerInventory;

  public abstract gameTitle: GameTitle;

  constructor(
    protected dialogRef: MatDialogRef<EditCarItemModalComponentUnion>,
    @Inject(MAT_DIALOG_DATA) protected data: EditCarItemModalData,
  ) {
    super();

    this.carItem = data.car;
    this.formControls.versionedLiveryId.setValue(data.car.versionedLiveryId);
    this.formControls.versionedTuneId.setValue(data.car.versionedTuneId);
    this.formControls.experiencePoints.setValue(data.car.experiencePoints);
    this.formControls.flags.setValue(data.car.flags);
    this.formControls.purchasePrice.setValue(data.car.purchasePrice);

    dialogRef
      .beforeClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => dialogRef.close(this.carItem));
  }

  public abstract getCarItem$(): Observable<PlayerInventoryCarItem>;

  public abstract editCarItem$(item: unknown): Observable<SteelheadPlayerInventory>;

  /** Saves updated car properties */
  public saveCarUpdates(): void {
    this.postMonitor = this.postMonitor.repeat();

    const updatedCar = cloneDeep(this.carItem);
    updatedCar.versionedLiveryId = this.formControls.versionedLiveryId.value;
    updatedCar.versionedTuneId = this.formControls.versionedTuneId.value;
    updatedCar.experiencePoints = new BigNumber(this.formControls.experiencePoints.value);
    updatedCar.flags = new BigNumber(this.formControls.flags.value);
    updatedCar.purchasePrice = new BigNumber(this.formControls.purchasePrice.value);

    this.editCarItem$(updatedCar)
      .pipe(
        switchMap(() => this.getCarItem$()), // Pull in car from services to get updated server-side props
        this.postMonitor.monitorSingleFire(),
        takeUntil(this.onDestroy$),
      )
      .subscribe(car => {
        this.carItem = car;
      });
  }
}
