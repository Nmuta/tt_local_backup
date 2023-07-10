import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  EditCarItemModalBaseComponent,
  EditCarItemModalData,
} from '../edit-car-item-modal.component';
import { GameTitle } from '@models/enums';
import { PlayerInventoryCarItem } from '@models/player-inventory-item';
import { SteelheadPlayerInventoryService } from '@services/api-v2/steelhead/player/inventory/steelhead-player-inventory.service';
import { EMPTY_STEELHEAD_PLAYER_INVENTORY, SteelheadPlayerInventory } from '@models/steelhead';
import { cloneDeep } from 'lodash';

/** Steelhead modal to set featured status of a UGC item. */
@Component({
  templateUrl: '../edit-car-item-modal.component.html',
  styleUrls: ['../edit-car-item-modal.component.scss'],
})
export class SteelheadEditCarItemModalComponent extends EditCarItemModalBaseComponent {
  public gameTitle = GameTitle.FM8;

  constructor(
    protected playerInventoryService: SteelheadPlayerInventoryService,
    protected dialogRef: MatDialogRef<SteelheadEditCarItemModalComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: EditCarItemModalData,
  ) {
    super(dialogRef, data);
  }

  /** Gets car item */
  public getCarItem$(): Observable<PlayerInventoryCarItem> {
    return this.playerInventoryService.getInventoryCarByProfileId$(
      this.data.xuid,
      this.data.profileId,
      this.data.car.vin,
    );
  }

  /** Edits car item. */
  public editCarItem$(updatedCar: PlayerInventoryCarItem): Observable<SteelheadPlayerInventory> {
    const inventoryUpdates = cloneDeep(EMPTY_STEELHEAD_PLAYER_INVENTORY);
    inventoryUpdates.cars.push(updatedCar);

    return this.playerInventoryService.editPlayerProfileItems$(
      this.data.xuid,
      this.data.externalProfileId,
      inventoryUpdates,
    );
  }
}
