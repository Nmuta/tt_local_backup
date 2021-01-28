import { Component, forwardRef, OnInit } from '@angular/core';
import { FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultBeta } from '@models/identity-query.model';
import { SunriseMasterInventory } from '@models/sunrise/sunrise-master-inventory.model';
import { Store } from '@ngxs/store';
import { GetSunriseMasterInventoryList } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.actions';
import { MasterInventoryListMemoryState } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.state';
import { GiftBasketBaseComponent, InventoryItemGroup } from '../gift-basket.base.component';

/** Sunrise gift basket. */
@Component({
  selector: 'sunrise-gift-basket',
  templateUrl: '../gift-basket.component.html',
  styleUrls: ['../gift-basket.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SunriseGiftBasketComponent),
      multi: true,
    },
  ],
})
export class SunriseGiftBasketComponent
  extends GiftBasketBaseComponent<IdentityResultBeta>
  implements OnInit {
  public title = GameTitleCodeName.FH4;

  constructor(protected readonly store: Store, protected readonly formBuilder: FormBuilder) {
    super(formBuilder);
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.isLoading = true;
    this.store.dispatch(new GetSunriseMasterInventoryList()).subscribe(() => {
      this.isLoading = false;
      const sunriseMasterInventory = this.store.selectSnapshot<SunriseMasterInventory>(
        MasterInventoryListMemoryState.sunriseMasterInventory,
      );
      this.masterInventory = sunriseMasterInventory;
      this.buildMatAutocompleteState();
    });
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const masterInventoryItems = this.masterInventory[prop] as any[];
        for (let i = 0; i < masterInventoryItems.length; i++) {
          const masterInventoryItem = masterInventoryItems[i];
          const inventoryItem = {
            itemType: prop,
            itemId: undefined,
            description: undefined,
            quantity: 0,
          };

          switch (prop) {
            case 'creditRewards':
              inventoryItem.itemId = -1;
              inventoryItem.description = masterInventoryItem;
              break;
            case 'cars':
              inventoryItem.itemId = masterInventoryItem.id;
              inventoryItem.description = masterInventoryItem.modelShort;
              break;
            case 'carHorns':
              inventoryItem.itemId = masterInventoryItem.id;
              inventoryItem.description = masterInventoryItem.displayName;
              break;
            case 'vanityItems':
              // IMPORTANT (vanity items): Ids 30-40 are wristbands with backing achievement/game progress. We're not handing them out, but we will allow a restore. June 9th, 2020 (Taken from Old Zendesk -> Steward 1/21/2021)
              if (masterInventoryItem.id >= 30 && masterInventoryItem.id <= 40) continue;
              inventoryItem.itemId = masterInventoryItem.id;
              inventoryItem.description = masterInventoryItem.itemId;
              break;
            case 'emotes':
              inventoryItem.itemId = masterInventoryItem.id;
              inventoryItem.description = masterInventoryItem.name;
              break;
            case 'quickChatLines':
              inventoryItem.itemId = masterInventoryItem.id;
              inventoryItem.description = masterInventoryItem.chatMessage;
              break;
            default:
              break;
          }

          inventoryGroup.items.push(inventoryItem);
        }

        this.inventoryItemGroups.push(inventoryGroup);
      }
    }
  }
}
