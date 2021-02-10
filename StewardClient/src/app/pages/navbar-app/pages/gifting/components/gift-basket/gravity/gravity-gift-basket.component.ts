import { Component, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GameTitleCodeName } from '@models/enums';
import { GravityPlayerInventory } from '@models/gravity';
import { GravityMasterInventoryLists } from '@models/gravity/gravity-master-inventory-list.model';
import { IdentityResultBeta } from '@models/identity-query.model';
import { Store } from '@ngxs/store';
import { GetGravityMasterInventoryList } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.actions';
import { MasterInventoryListMemoryState } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.state';
import { GiftBasketBaseComponent } from '../gift-basket.base.component';

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

        // TODO: Call buildMatAutocompleteState() so the mat-autocomplete data can be built and send down to the item-selection component
        // We are currently blocked on this while we figure out what all is required for Gravity gifting (mostly around Cars and if we need to send more data than just itemId)

        // TODO: When a valid game settings updates the masterInventory, we need to verify the existing contents of a gift basket
        // in relation to the new master inventory (show item errors & disallow gift send while there are errors)
      });
    } else {
      this.masterInventory = undefined;

      // TODO:When no/ bad game settings, we need to show show errors for all items in the gift basket and disallow gift send
    }
  }
}
