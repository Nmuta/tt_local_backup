import BigNumber from 'bignumber.js';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApolloMasterInventory } from '@models/apollo';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { ApolloService } from '@services/apollo';
import { PlayerInventoryItemListWithService } from '@models/master-inventory-item-list';
import { GameTitle } from '@models/enums';
import { makeItemList } from '../player-inventory-helpers';
import { PlayerInventoryComponentContract } from '../player-inventory.component';
import { InventoryItemListDisplayComponentContract } from '@views/inventory-item-list-display/inventory-item-list-display.component';
import { PlayerInventoryProfile } from '@models/player-inventory-profile';

/** Displays an Apollo player's inventory. */
@Component({
  selector: 'apollo-player-inventory',
  templateUrl: './apollo-player-inventory.component.html',
  styleUrls: ['./apollo-player-inventory.component.scss'],
})
export class ApolloPlayerInventoryComponent {
  /** Player Identity. */
  @Input() public identity: IdentityResultAlpha;
  /** Inventory profile Id. */
  @Input() public profile: PlayerInventoryProfile;
  /** Outputs when player inventory is found. */
  @Output() public inventoryFound = new EventEmitter<ApolloMasterInventory>();

  public service: PlayerInventoryComponentContract<ApolloMasterInventory, IdentityResultAlpha>;

  public emptyInventoryItemListService: InventoryItemListDisplayComponentContract = {
    openCarEditModal$: undefined,
    editItemQuantity$: undefined,
    deleteItem$: undefined,
  };

  constructor(private readonly apollo: ApolloService) {
    this.service = {
      gameTitle: GameTitle.FM7,
      getPlayerInventoryByIdentity$: identity =>
        this.apollo.getPlayerInventoryByXuid$(identity.xuid),
      getPlayerInventoryByIdentityAndProfileId$: (_identity, profileId) =>
        this.apollo.getPlayerInventoryByProfileId$(profileId as BigNumber),
      makewhatToShowList: inventory => this.makewhatToShowList(inventory),
      inventoryFound: inventory => this.inventoryFound.emit(inventory),
    };
  }

  /** Implement to specify the expando tables to show. */
  protected makewhatToShowList(
    inventory: ApolloMasterInventory,
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

    credits.service = this.emptyInventoryItemListService;
    cars.service = this.emptyInventoryItemListService;
    vanityItems.service = this.emptyInventoryItemListService;

    return [credits, cars, vanityItems];
  }
}
