import { Component, forwardRef } from '@angular/core';
import { FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultBeta } from '@models/identity-query.model';
import { Store } from '@ngxs/store';
import { GiftBasketBaseComponent, InventoryItemGroup } from '../gift-basket.base.component';

/** Apollo gift basket. */
@Component({
  selector: 'apollo-gift-basket',
  templateUrl: '../gift-basket.component.html',
  styleUrls: ['../gift-basket.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ApolloGiftBasketComponent),
      multi: true,
    },
  ],
})
export class ApolloGiftBasketComponent extends GiftBasketBaseComponent<IdentityResultBeta> {
  public title = GameTitleCodeName.FM7;
  public disableCard: boolean = true;

  constructor(protected readonly store: Store, protected readonly formBuilder: FormBuilder) {
    super(formBuilder);
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

        // TODO: Switch 'unknown' to Apollo inventory item once it has been built
        const masterInventoryItems = this.masterInventory[prop] as unknown[];
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
