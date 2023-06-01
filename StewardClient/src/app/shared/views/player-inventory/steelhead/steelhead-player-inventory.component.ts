import { Component, EventEmitter, Input, OnInit, OnChanges, Output } from '@angular/core';
import {
  EMPTY_STEELHEAD_PLAYER_INVENTORY,
  SteelheadMasterInventory,
  SteelheadPlayerInventory,
} from '@models/steelhead';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { PlayerInventoryItemListWithService } from '@models/master-inventory-item-list';
import { GameTitle } from '@models/enums';
import { SteelheadPlayerInventoryService } from '@services/api-v2/steelhead/player/inventory/steelhead-player-inventory.service';
import { PlayerInventoryComponentContract } from '../player-inventory.component';
import BigNumber from 'bignumber.js';
import { makeItemList } from '../player-inventory-helpers';
import { Store } from '@ngxs/store';
import { GetSteelheadMasterInventoryList } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.actions';
import { Observable, takeUntil } from 'rxjs';
import { BaseComponent } from '@components/base-component/base.component';
import { MasterInventoryListMemoryState } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.state';
import { cloneDeep } from 'lodash';
import { MasterInventoryItem } from '@models/master-inventory-item';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ItemSelectionComponentContract } from '@tools-app/pages/gifting/components/item-selection/item-selection.component';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { InventoryItemListDisplayComponentContract } from '@views/inventory-item-list-display/inventory-item-list-display.component';
import { MatDialog } from '@angular/material/dialog';
import { FullPlayerInventoryProfile } from '@models/player-inventory-profile';
import { PlayerInventoryItem } from '@models/player-inventory-item';

/** Displays an Steelhead player's inventory. */
@Component({
  selector: 'steelhead-player-inventory',
  templateUrl: './steelhead-player-inventory.component.html',
  styleUrls: ['./steelhead-player-inventory.component.scss'],
})
export class SteelheadPlayerInventoryComponent extends BaseComponent implements OnInit, OnChanges {
  /** Player Identity. */
  @Input() public identity: IdentityResultAlpha;
  /** Inventory profile Id. */
  @Input() public profile: FullPlayerInventoryProfile;
  /** If true, will allow adding, editing, and removing of inventory items.. */
  @Input() public allowEditing: boolean = false;
  /** Outputs when player inventory is found. */
  @Output() public inventoryFound = new EventEmitter<SteelheadMasterInventory>();

  public gameTitle = GameTitle.FM8;
  public permissionAttribute = PermAttributeName.ManagePlayerInventory;

  public itemSelectionList: SteelheadMasterInventory;
  public itemSelectionService: ItemSelectionComponentContract;
  public playerInventoryComponentService: PlayerInventoryComponentContract<
    SteelheadMasterInventory,
    IdentityResultAlpha
  >;

  public emptyInventoryItemListService: InventoryItemListDisplayComponentContract = {
    openCarEditModal$: undefined,
    editItemQuantity$: undefined,
    deleteItem$: undefined,
  };

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store,
    private readonly playerInventoryService: SteelheadPlayerInventoryService,
  ) {
    super();

    this.playerInventoryComponentService = {
      gameTitle: this.gameTitle,
      getPlayerInventoryByIdentity$: identity =>
        this.playerInventoryService.getInventoryByXuid$(identity.xuid),
      getPlayerInventoryByIdentityAndProfileId$: (identity, profileId) =>
        this.playerInventoryService.getInventoryByProfileId$(identity.xuid, profileId as BigNumber),
      makewhatToShowList: inventory => this.makewhatToShowList(inventory),
      inventoryFound: inventory => this.inventoryFound.emit(inventory),
    };
  }

  /** Lifecyle hook. */
  public ngOnInit(): void {
    this.store
      .dispatch(new GetSteelheadMasterInventoryList())
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        const steelheadMasterInventory = this.store.selectSnapshot<SteelheadMasterInventory>(
          MasterInventoryListMemoryState.steelheadMasterInventory,
        );

        // must be cloned because a child component modifies this value, and modification of state is disallowed
        const masterInventory = cloneDeep(steelheadMasterInventory);
        // TMP: Remove cars until we can support their options
        masterInventory.cars = [];
        this.itemSelectionList = masterInventory;
      });
  }

  /** Lifecycle hook. */
  public ngOnChanges(_changes: BetterSimpleChanges<SteelheadPlayerInventoryComponent>): void {
    this.itemSelectionService = {
      addItemToInventory$: (item: MasterInventoryItem) => {
        const inventoryUpdates = cloneDeep(EMPTY_STEELHEAD_PLAYER_INVENTORY);
        inventoryUpdates[item.itemType].push(item);
        return this.editInventory(inventoryUpdates, true);
      },
    };
  }

  /** Event when an item is added to player inventory. */
  public addItemEvent(_item: MasterInventoryItem) {
    // Force refresh of player inventory
    this.profile = cloneDeep(this.profile);
  }

  /** Implement to specify the expando tables to show. */
  protected makewhatToShowList(
    inventory: SteelheadMasterInventory,
  ): PlayerInventoryItemListWithService[] {
    const credits = makeItemList(
      'Credit Rewards',
      inventory.creditRewards,
    ) as PlayerInventoryItemListWithService;
    const cars = makeItemList('Cars', inventory.cars) as PlayerInventoryItemListWithService;
    const vanityItems = makeItemList(
      'Vanity Items',
      inventory.vanityItems,
    ) as PlayerInventoryItemListWithService;

    credits.service = cloneDeep(this.emptyInventoryItemListService);
    cars.service = cloneDeep(this.emptyInventoryItemListService);
    vanityItems.service = cloneDeep(this.emptyInventoryItemListService);

    // Setup services for each inventory type
    if (this.allowEditing) {
      // CREDITS
      credits.service.editItemQuantity$ = (item, quantityChange) => {
        const inventoryUpdates = cloneDeep(EMPTY_STEELHEAD_PLAYER_INVENTORY);
        inventoryUpdates.creditRewards.push({
          id: item.id,
          quantity: Math.abs(quantityChange),
        } as PlayerInventoryItem);

        return this.editInventory(inventoryUpdates, quantityChange > 0);
      };

      // TODO: Cars coming next as credits were top priority (lugeiken 2023/05/09)
      // cars.service.openCarEditModal$ = item => {
      //   const dialogRef = this.dialog.open(SteelheadEditCarItemModalComponent, {
      //     data: item,
      //   });
      //   return dialogRef.afterClosed();
      // };

      // VANITY ITEMS
      vanityItems.service.editItemQuantity$ = (item, quantityChange) => {
        const inventoryUpdates = cloneDeep(EMPTY_STEELHEAD_PLAYER_INVENTORY);
        inventoryUpdates.vanityItems.push({
          id: item.id,
          quantity: Math.abs(quantityChange),
        } as PlayerInventoryItem);

        return this.editInventory(inventoryUpdates, quantityChange > 0);
      };
      vanityItems.service.deleteItem$ = item => {
        const inventoryUpdates = cloneDeep(EMPTY_STEELHEAD_PLAYER_INVENTORY);
        inventoryUpdates.vanityItems.push({
          id: item.id,
          quantity: item.quantity,
        } as PlayerInventoryItem);

        return this.editInventory(inventoryUpdates, false);
      };
    }

    return [credits, cars, vanityItems];
  }

  private editInventory(
    inventoryUpdates: SteelheadPlayerInventory,
    addUpdates: boolean,
  ): Observable<PlayerInventoryItem[]> {
    return addUpdates
      ? this.playerInventoryService.editPlayerProfileItems$(
          this.identity.xuid,
          this.profile.externalProfileId,
          inventoryUpdates,
        )
      : this.playerInventoryService.deletePlayerProfileItems$(
          this.identity.xuid,
          this.profile.externalProfileId,
          inventoryUpdates,
        );
  }
}
