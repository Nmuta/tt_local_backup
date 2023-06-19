import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { renderGuard } from '@helpers/rxjs';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { MSError } from '@models/error.model';
import {
  PlayerInventoryItemList,
  PlayerInventoryItemListEntry,
} from '@models/master-inventory-item-list';
import {
  PlayerInventoryCarItem,
  PlayerInventoryItem,
  isPlayerInventoryItem,
  toPlayerInventoryCarItem,
} from '@models/player-inventory-item';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { cloneDeep } from 'lodash';
import { Observable, filter, take, takeUntil } from 'rxjs';

/** Service contract for InventoryItemListDisplayComponent. */
export interface InventoryItemListDisplayComponentContract {
  /** Optional: Allows editing of inventory car items. */
  openCarEditModal$(item: PlayerInventoryItem): Observable<PlayerInventoryCarItem>;
  /** Optional: Allows editing of inventory items. */
  editItemQuantity$(item: PlayerInventoryItem, quantityChange: number): Observable<unknown>;
  /** Optional: Allows deleting of inventory items. */
  deleteItem$(item: PlayerInventoryItem): Observable<unknown>;
}

/** Helper component for display lists of master inventory items. */
@Component({
  selector: 'inventory-item-list-display',
  templateUrl: './inventory-item-list-display.component.html',
  styleUrls: ['./inventory-item-list-display.component.scss'],
})
export class InventoryItemListDisplayComponent extends BaseComponent implements OnInit, OnChanges {
  /** Player inventory list to show. */
  @Input() public whatToShow: PlayerInventoryItemList;
  /** Serivce contract for InventoryItemListDisplayComponent. */
  @Input() public service: InventoryItemListDisplayComponentContract;

  public inventoryColumns: string[] = [
    'quantity',
    'description',
    'errors',
    'dateAquired',
    'actions',
  ];
  public errors: MSError[];

  public nonCarFormControls = {
    quantity: new FormControl('', [Validators.required, Validators.min(1)]),
  };

  public itemListTableSource = new BetterMatTableDataSource<PlayerInventoryItemListEntry>();

  /** Returns true if car items can be edited.  */
  public get canEditCarItem(): boolean {
    return !!this.service && this.service?.openCarEditModal$ !== undefined;
  }

  /** Returns true if item quantities can be edited.  */
  public get canEditItemQuantity(): boolean {
    return !!this.service && this.service?.editItemQuantity$ !== undefined;
  }

  /** Returns true if items can be delete.  */
  public get canDeleteItem(): boolean {
    return !!this.service && this.service?.deleteItem$ !== undefined;
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    const dateAquiredIndex = this.inventoryColumns.findIndex(v => v === 'dateAquired');
    if (this.whatToShow.items.length <= 0 || !isPlayerInventoryItem(this.whatToShow.items[0])) {
      this.inventoryColumns.splice(dateAquiredIndex, 1);
    }

    this.errors = this.whatToShow.items.map(v => v.error).filter(error => !!error);
  }

  /** Initialization hook. */
  public ngOnChanges(changes: BetterSimpleChanges<InventoryItemListDisplayComponent>): void {
    if (!this.service) {
      throw new Error('Service contract undefined for InventoryItemListDisplayComponent.');
    }

    if (!!changes.whatToShow) {
      this.whatToShow.items.forEach(item => {
        this.resetItemFormsAndMonitors(item);
      });

      this.itemListTableSource.data = this.whatToShow.items;
    }
  }

  /** Type safety for the template. */
  public entry(input: unknown): PlayerInventoryItemListEntry {
    return input as PlayerInventoryItemListEntry;
  }

  /** Disables edit mode for an inventory list entry. */
  public enableEditMode(item: PlayerInventoryItemListEntry) {
    if (this.isCarItem(item)) {
      throw new Error(
        'Car items should not support item quantity changes. Verify InventoryItemListDisplayComponentContract is implementing openCarEditModal$ instead of editItemQuantity$',
      );
    }

    this.resetItemFormsAndMonitors(item);
    item.isInEditMode = true;
  }

  /** Disables edit mode for an inventory list entry. */
  public disableEditMode(item: PlayerInventoryItemListEntry) {
    this.resetItemFormsAndMonitors(item);
    item.isInEditMode = false;
  }

  /** Edits a car item. */
  public editCarItem(item: PlayerInventoryCarItem, index: number): void {
    if (!this.isCarItem(item)) {
      throw new Error(
        'Non-car items should not support car property changes. Verify InventoryItemListDisplayComponentContract is implementing editItemQuantity$ instead of openCarEditModal$',
      );
    }

    this.service
      .openCarEditModal$(toPlayerInventoryCarItem(item))
      .pipe(
        take(1),
        filter(updatedCar => !!updatedCar),
        takeUntil(this.onDestroy$),
      )
      .subscribe(updatedCar => {
        const data = cloneDeep(this.itemListTableSource.data);
        data[index] = updatedCar;
        this.itemListTableSource.data = data;
      });
  }

  /** Edits an item based on internal form controls. */
  public editItemQuantity(item: PlayerInventoryItemListEntry): void {
    if (!this.canEditItemQuantity || item.editFormGroup.invalid) {
      return;
    }

    const oldQuantity = item.quantity;
    const newQuantity = item.editFormControls.quantity.value;
    const quantityChange = newQuantity - oldQuantity;
    item.editMonitor = item.editMonitor.repeat();
    this.service
      .editItemQuantity$(item, quantityChange)
      .pipe(item.editMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(_test => {
        item.quantity = newQuantity;

        renderGuard(() => {
          this.disableEditMode(item);
        });
      });
  }

  /** Deletes an item. */
  public deleteItem(item: PlayerInventoryItemListEntry, itemIndex: number): void {
    if (!this.canDeleteItem) {
      return;
    }

    item.deleteMonitor = item.deleteMonitor.repeat();
    this.service
      .deleteItem$(item)
      .pipe(item.deleteMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        const data = this.itemListTableSource.data;
        data.splice(itemIndex, 1);
        this.itemListTableSource.data = data;
        this.whatToShow.description = `${data.length} Total`;
      });
  }

  private resetItemFormsAndMonitors(item: PlayerInventoryItemListEntry): void {
    item.editFormControls = cloneDeep(this.nonCarFormControls);
    item.editFormControls.quantity.setValue(item.quantity);
    item.editFormGroup = new FormGroup(item.editFormControls);
    item.editMonitor = new ActionMonitor('Edit inventory item');
    item.deleteMonitor = new ActionMonitor('Delete inventory item');
  }

  private isCarItem(item: PlayerInventoryItemListEntry): boolean {
    return !!item['vin'];
  }
}
