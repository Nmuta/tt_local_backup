import { Component, forwardRef, OnInit } from '@angular/core';
import { FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultBeta } from '@models/identity-query.model';
import { MasterInventoryItem } from '@models/master-inventory-item';
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

        const masterInventoryItems = this.masterInventory[prop] as MasterInventoryItem[];
        for (let i = 0; i < masterInventoryItems.length; i++) {
          const masterInventoryItem = masterInventoryItems[i];
          masterInventoryItem.itemType = prop;
          inventoryGroup.items.push(masterInventoryItem);
        }

        this.inventoryItemGroups.push(inventoryGroup);
      }
    }
  }
}
