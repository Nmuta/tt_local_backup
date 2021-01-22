import { Component, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GameTitleCodeName } from '@models/enums';
import { GravityPlayerInventory } from '@models/gravity';
import { GravityMasterInventoryLists } from '@models/gravity/gravity-master-inventory-list.model';
import { GravityGameSettingsItem } from '@models/gravity/inventory-items/gravity-game-settings-item.model';
import { IdentityResultBeta } from '@models/identity-query.model';
import { Store } from '@ngxs/store';
import { GetGravityMasterInventoryList } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.actions';
import { MasterInventoryListMemoryState } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.state';
import { GiftBasketBaseComponent, InventoryItemGroup } from '../gift-basket.base.component';

/** Gravity gift basket. */
@Component({
  selector: 'gravity-gift-basket',
  templateUrl: '../gift-basket.component.html',
  styleUrls: ['../gift-basket.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GravityGiftBasketComponent),
      multi: true,
    },
  ],
})
export class GravityGiftBasketComponent
  extends GiftBasketBaseComponent<IdentityResultBeta>
  implements OnChanges {
  @Input() public playerInventory: GravityPlayerInventory;

  public title = GameTitleCodeName.Street;
  public hasGameSettings: boolean = true;

  constructor(protected readonly store: Store, protected readonly formBuilder: FormBuilder) {
    super(formBuilder);
  }

  /** Angular lifecycle */
  public ngOnChanges(changes: SimpleChanges): void {
    if (!!changes?.playerInventory?.currentValue) {
      this.isLoading = true;
      const gameSettings = this.playerInventory.previousGameSettingsId;
      this.store.dispatch(new GetGravityMasterInventoryList(gameSettings)).subscribe(() => {
        this.isLoading = false;
        const gravityMasterInventory = this.store.selectSnapshot<GravityMasterInventoryLists>(
          MasterInventoryListMemoryState.gravityMasterInventory,
        );
        this.masterInventory = gravityMasterInventory[gameSettings];

        // TODO: When a valid game settings updates the masterInventory, we need to verify the existing contents of a gift basket
        // in relation to the new master inventory (show item errors & disallow gift send while there are errors)
      });
    } else {
      this.masterInventory = undefined;

      // TODO:When no/ bad game settings, we need to show show errors for all items in the gift basket and disallow gift send
    }
  }

  /** Sets up the stateGroups variable used with the autocomplete */
  public buildMatAutocompleteState(): void {
    // Loop through master list properties (categories)
    for (const prop in this.masterInventory) {
      if (this.masterInventory.hasOwnProperty(prop)) {
        const inventoryGroup = {
          category: prop,
          items: [],
        } as InventoryItemGroup;

        const masterInventoryItems = this.masterInventory[prop] as GravityGameSettingsItem[];
        // IMPORTANT (vanity items): Ids 30-40 are wristbands with backing achievement/game progress. We're not handing them out, but we will allow a restore. June 9th, 2020
        for (let i = 0; i < masterInventoryItems.length; i++) {
          // const masterInventoryItem = masterInventoryItems[i];
          const inventoryItem = {
            itemType: prop,
            itemId: undefined,
            description: undefined,
            quantity: BigInt(0),
          };

          // switch(prop) {
          //   case 'creditRewards':
          //     inventoryItem.itemId = -1;
          //     inventoryItem.description = masterInventoryItem;
          //     break;
          //   case 'cars':
          //     inventoryItem.itemId = masterInventoryItem.id;
          //     inventoryItem.description = masterInventoryItem.modelShort;
          //     break;
          //   case 'carHorns':
          //     inventoryItem.itemId = masterInventoryItem.id;
          //     inventoryItem.description = masterInventoryItem.displayName;
          //     break;
          //   case 'vanityItems':
          //     inventoryItem.itemId = masterInventoryItem.id;
          //     inventoryItem.description = masterInventoryItem.itemId;
          //     break;
          //   case 'emotes':
          //     inventoryItem.itemId = masterInventoryItem.id;
          //     inventoryItem.description = masterInventoryItem.name;
          //     break;
          //   case 'quickChatLines':
          //     inventoryItem.itemId = masterInventoryItem.id;
          //     inventoryItem.description = masterInventoryItem.chatMessage;
          //     break;
          //   default:
          //     break;
          // }

          inventoryGroup.items[inventoryGroup.items.length] = inventoryItem;
        }

        this.inventoryItemGroups[this.inventoryItemGroups.length] = inventoryGroup;
      }
    }
  }
}
