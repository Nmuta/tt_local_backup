import { Component, forwardRef, OnInit } from '@angular/core';
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
export class ApolloGiftBasketComponent
  extends GiftBasketBaseComponent<IdentityResultBeta>
  implements OnInit {
  public title = GameTitleCodeName.FM7;
  public disableCard: boolean = true;

  constructor(protected readonly store: Store, protected readonly formBuilder: FormBuilder) {
    super(formBuilder);
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.isLoading = true;
    // TODO: Uncomment once apollo master inventory is setup.
    // This is currently blocked since apollo vanity item data is incorrect

    // this.store.dispatch(new GetApolloMasterInventoryList()).subscribe(() => {
    //   this.isLoading = false;
    //   const apolloMasterInventory = this.store.selectSnapshot<ApolloMasterInventory>(
    //     MasterInventoryListMemoryState.sunriseMasterInventory,
    //   );
    //   this.masterInventory = apolloMasterInventory;
    //   this.buildMatAutocompleteState();
    // });
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
        for (let i = 0; i < masterInventoryItems.length; i++) {
          // const masterInventoryItem = masterInventoryItems[i];
          const inventoryItem = {
            itemType: prop,
            itemId: undefined,
            description: undefined,
            quantity: BigInt(0),
          };

          // TODO: Update this logic so each property in ApolloMasterInventory is handled according to build valid
          // inventory items

          // switch(prop) {
          //   case 'itemType':
          //     inventoryItem.itemId = -1;
          //     inventoryItem.description = masterInventoryItem;
          //     break;
          //   default:
          //     break;
          // }

          inventoryGroup.items.push(inventoryItem);
        }

        this.inventoryItemGroups.push(inventoryGroup);
      }
    }
  }
}
