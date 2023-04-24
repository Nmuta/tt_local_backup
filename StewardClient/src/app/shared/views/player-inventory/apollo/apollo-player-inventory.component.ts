import BigNumber from 'bignumber.js';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApolloMasterInventory } from '@models/apollo';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { ApolloService } from '@services/apollo';
import { PlayerInventoryItemList } from '@models/master-inventory-item-list';
import { GameTitle } from '@models/enums';
import { makeItemList } from '../player-inventory-helpers';
import { PlayerInventoryComponentContract } from '../player-inventory.component';

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
  @Input() public profileId: BigNumber | string | undefined | null;
  /** Outputs when player inventory is found. */
  @Output() public inventoryFound = new EventEmitter<ApolloMasterInventory>();

  public service: PlayerInventoryComponentContract<ApolloMasterInventory, IdentityResultAlpha>;

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
  protected makewhatToShowList(inventory: ApolloMasterInventory): PlayerInventoryItemList[] {
    return [
      makeItemList('Credit Rewards', inventory.creditRewards),
      makeItemList('Cars', inventory.cars),
      makeItemList('Vanity Items', inventory.vanityItems),
    ];
  }
}
