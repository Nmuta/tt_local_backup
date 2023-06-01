import BigNumber from 'bignumber.js';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { OpusMasterInventory } from '@models/opus';
import { OpusService } from '@services/opus';
import { PlayerInventoryItemListWithService } from '@models/master-inventory-item-list';
import { GameTitle } from '@models/enums';
import { makeItemList } from '../player-inventory-helpers';
import { PlayerInventoryComponentContract } from '../player-inventory.component';
import { InventoryItemListDisplayComponentContract } from '@views/inventory-item-list-display/inventory-item-list-display.component';
import { OldPlayerInventoryProfile } from '@models/player-inventory-profile';

/** Displays an Opus player's inventory. */
@Component({
  selector: 'opus-player-inventory',
  templateUrl: './opus-player-inventory.component.html',
  styleUrls: ['./opus-player-inventory.component.scss'],
})
export class OpusPlayerInventoryComponent {
  /** Player Identity. */
  @Input() public identity: IdentityResultAlpha;
  /** Inventory profile. */
  @Input() public profile: OldPlayerInventoryProfile;
  /** Outputs when player inventory is found. */
  @Output() public inventoryFound = new EventEmitter<OpusMasterInventory>();

  public service: PlayerInventoryComponentContract<OpusMasterInventory, IdentityResultAlpha>;

  public emptyInventoryItemListService: InventoryItemListDisplayComponentContract = {
    openCarEditModal$: undefined,
    editItemQuantity$: undefined,
    deleteItem$: undefined,
  };

  constructor(private readonly opus: OpusService) {
    this.service = {
      gameTitle: GameTitle.FH3,
      getPlayerInventoryByIdentity$: identity => this.opus.getPlayerInventoryByXuid$(identity.xuid),
      getPlayerInventoryByIdentityAndProfileId$: (_identity, profileId) =>
        this.opus.getPlayerInventoryByProfileId$(profileId as BigNumber),
      makewhatToShowList: inventory => this.makewhatToShowList(inventory),
      inventoryFound: inventory => this.inventoryFound.emit(inventory),
    };
  }

  /** Implement to specify the expando tables to show. */
  protected makewhatToShowList(
    inventory: OpusMasterInventory,
  ): PlayerInventoryItemListWithService[] {
    const credits = makeItemList(
      'Credit Rewards',
      inventory.creditRewards,
    ) as PlayerInventoryItemListWithService;
    const cars = makeItemList('Cars', inventory.cars) as PlayerInventoryItemListWithService;

    credits.service = this.emptyInventoryItemListService;
    cars.service = this.emptyInventoryItemListService;

    return [credits, cars];
  }
}
