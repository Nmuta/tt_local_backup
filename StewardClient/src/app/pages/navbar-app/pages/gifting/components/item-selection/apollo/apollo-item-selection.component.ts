import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { InventoryItemGroup } from '../../gift-basket/gift-basket.base.component';
import { ItemSelectionBaseComponent } from '../item-selection.base.component';

/** Apollo gift basket. */
@Component({
  selector: 'apollo-item-selection',
  templateUrl: '../item-selection.component.html',
  styleUrls: ['../item-selection.component.scss'],
  providers: [],
})
export class ApolloItemSelectionComponent extends ItemSelectionBaseComponent {
  constructor(protected readonly formBuilder: FormBuilder) {
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

        const masterInventoryItems = this.masterInventory[prop] as any[];
        // IMPORTANT (vanity items): Ids 30-40 are wristbands with backing achievement/game progress. We're not handing them out, but we will allow a restore. June 9th, 2020
        for (let i = 0; i < masterInventoryItems.length; i++) {
          // const masterInventoryItem = masterInventoryItems[i];
          const inventoryItem = { itemType: prop, itemId: undefined, description: undefined, quantity: BigInt(0) };

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

        this.stateGroups[this.stateGroups.length] = inventoryGroup;
      }
    }

    this.stateGroupOptions = this.stateForm.get('itemInput')?.valueChanges.pipe(
      startWith(''),
      map(value => this.filterGroup(value)),
    );
  }
}
