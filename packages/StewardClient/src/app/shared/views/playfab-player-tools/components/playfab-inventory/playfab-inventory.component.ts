import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, AbstractControl, FormControl, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { HCI } from '@environments/environment';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { GameTitle } from '@models/enums';
import { PlayFabCollectionId, PlayFabInventoryItem, PlayFabVoucher } from '@models/playfab';
import { PlayFabProfile } from '@services/api-v2/woodstock/players/playfab/woodstock-players-playfab.service';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import BigNumber from 'bignumber.js';
import { cloneDeep } from 'lodash';
import { Observable, delay } from 'rxjs';

/** Service contract for the PlayFabInventoryComponent. */
export interface PlayFabInventoryServiceContract {
  /** Game title the service contract is associated with. */
  gameTitle: GameTitle;
  /** Gets player transaction history. */
  getPlayFabCurrencyInventory$(
    playfabPlayerTitleId: string,
    playFabCollectionId: PlayFabCollectionId,
  ): Observable<PlayFabInventoryItem[]>;
  addPlayFabItem$(
    playfabPlayerTitleId: string,
    playFabCollectionId: PlayFabCollectionId,
    itemId: string,
    amount: BigNumber,
  ): Observable<void>;
  removePlayFabItem$(
    playfabPlayerTitleId: string,
    playFabCollectionId: PlayFabCollectionId,
    itemId: string,
    amount: BigNumber,
  ): Observable<void>;
}

type PlayFabInventoryItemListEntry = PlayFabInventoryItem & {
  isInEditMode?: boolean;
  editFormGroup?: FormGroup;
  editFormControls?: { [key: string]: AbstractControl };
  editMonitor?: ActionMonitor;
};

/** Component to view and manage playfab player inventory. */
@Component({
  selector: 'playfab-inventory',
  templateUrl: './playfab-inventory.component.html',
  styleUrls: ['./playfab-inventory.component.scss'],
})
export class PlayFabInventoryComponent extends BaseComponent implements OnChanges {
  /** The component service contract */
  @Input() service: PlayFabInventoryServiceContract;

  /** PlayFab player profile. */
  @Input() playfabProfile: PlayFabProfile;

  /** PlayFab collection id. */
  @Input() playfabCollectionId: PlayFabCollectionId;

  /** Event emitted when any inventory amount changes. */
  @Output() inventoryChangeEvent = new EventEmitter<void>();

  public currencyFormControls = {
    amount: new FormControl('', [Validators.required, Validators.min(0), Validators.max(10)]),
  };

  public getInventoryMonitor = new ActionMonitor('Get PlayFab inventory');
  public allEditMonitors: ActionMonitor[] = [];

  public displayedColumns = ['item', 'metadata', 'amount', 'actions'];
  public inventoryItems = new BetterMatTableDataSource<PlayFabInventoryItemListEntry>([]);
  public vouchers: PlayFabVoucher[] = [];

  public permission: PermAttributeName = PermAttributeName.ManagePlayFabInventory;

  /** Gets the service contract game title. */
  public get gameTitle(): GameTitle {
    return this.service.gameTitle;
  }

  /** Lifecycle hook. */
  public ngOnChanges(changes: BetterSimpleChanges<PlayFabInventoryComponent>): void {
    if (!this.service) {
      throw new Error('No service is defined for PlayFab transaction history component.');
    }

    if (
      (!!changes.playfabProfile || !!changes.playfabCollectionId) &&
      !!this.playfabProfile?.title &&
      !!this.playfabCollectionId
    ) {
      this.getInventoryMonitor = this.getInventoryMonitor.repeat();
      this.service
        .getPlayFabCurrencyInventory$(this.playfabProfile?.title, this.playfabCollectionId)
        .pipe(this.getInventoryMonitor.monitorSingleFire())
        .subscribe(inventoryItems => {
          this.inventoryItems.data = inventoryItems.map(item => {
            const itemAsListEntry = item as PlayFabInventoryItemListEntry;
            this.resetItemForms(itemAsListEntry);
            this.resetItemMonitor(itemAsListEntry);
            return itemAsListEntry;
          });
        });
    }
  }

  /** Disables edit mode for an inventory list entry. */
  public enableEditMode(item: PlayFabInventoryItemListEntry): void {
    this.resetItemForms(item);
    item.isInEditMode = true;
  }

  /** Disables edit mode for an inventory list entry. */
  public disableEditMode(item: PlayFabInventoryItemListEntry): void {
    this.resetItemForms(item);
    item.isInEditMode = false;
  }

  /** Changes the currency amount of the item provided. */
  public changeCurrencyAmount(item: PlayFabInventoryItemListEntry): void {
    const newAmount = item.editFormControls.amount.value;
    const oldAmount = item.amount;
    const changeAmount = Math.abs(newAmount - oldAmount);

    const changeFunc =
      newAmount > oldAmount ? this.service.addPlayFabItem$ : this.service.removePlayFabItem$;

    changeFunc(
      this.playfabProfile?.title,
      this.playfabCollectionId,
      item.id,
      new BigNumber(changeAmount),
    )
      .pipe(
        // Give PlayFab time to propagate this action so on reload we get up-to-date data
        delay(HCI.PlayFabPropagation),
        item.editMonitor.monitorSingleFire(),
      )
      .subscribe(() => {
        this.resetItemMonitor(item);
        this.inventoryChangeEvent.emit();
      });
  }

  private resetItemForms(item: PlayFabInventoryItemListEntry): void {
    item.editFormControls = cloneDeep(this.currencyFormControls);
    item.editFormControls.amount.setValue(item.amount);
    item.editFormGroup = new FormGroup(item.editFormControls);
  }

  private resetItemMonitor(item: PlayFabInventoryItemListEntry): void {
    if (!!item?.editMonitor) {
      const monitorIndex = this.allEditMonitors.findIndex(
        monitor => monitor.id === item.editMonitor.id,
      );
      if (monitorIndex >= 0) {
        this.allEditMonitors.splice(monitorIndex, 1);
      }
    }

    item.editMonitor = new ActionMonitor('Change PlayFab currency amount');
    this.allEditMonitors.push(item.editMonitor);
  }
}
