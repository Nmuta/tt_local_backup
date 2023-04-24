import BigNumber from 'bignumber.js';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { WoodstockMasterInventory } from '@models/woodstock';
import { WoodstockService } from '@services/woodstock';
import { PlayerInventoryItemList } from '@models/master-inventory-item-list';
import { GameTitle } from '@models/enums';
import { WOODSTOCK_UNIQUE_CAR_IDS_LOOKUP } from '@environments/app-data/item-lists/woodstock-special-cars';
import { PlayerInventoryComponentContract } from '../player-inventory.component';
import { addWarnings, makeItemList } from '../player-inventory-helpers';

/** Displays a Woodstock player's inventory. */
@Component({
  selector: 'woodstock-player-inventory',
  templateUrl: './woodstock-player-inventory.component.html',
  styleUrls: ['./woodstock-player-inventory.component.scss'],
})
export class WoodstockPlayerInventoryComponent {
  /** Player Identity. */
  @Input() public identity: IdentityResultAlpha;
  /** Inventory profile Id. */
  @Input() public profileId: BigNumber | string | undefined | null;
  /** Outputs when player inventory is found. */
  @Output() public inventoryFound = new EventEmitter<WoodstockMasterInventory>();

  public service: PlayerInventoryComponentContract<WoodstockMasterInventory, IdentityResultAlpha>;

  constructor(private readonly woodstock: WoodstockService) {
    this.service = {
      gameTitle: GameTitle.FH5,
      getPlayerInventoryByIdentity$: identity =>
        this.woodstock.getPlayerInventoryByXuid$(identity.xuid),
      getPlayerInventoryByIdentityAndProfileId$: (_identity, profileId) =>
        this.woodstock.getPlayerInventoryByProfileId$(profileId as BigNumber),
      makewhatToShowList: inventory => this.makewhatToShowList(inventory),
      inventoryFound: inventory => this.inventoryFound.emit(inventory),
    };
  }

  /** Implement to specify the expando tables to show. */
  protected makewhatToShowList(inventory: WoodstockMasterInventory): PlayerInventoryItemList[] {
    const cars = makeItemList('Cars', inventory.cars);
    const carsWithWarnings = addWarnings(
      cars,
      WOODSTOCK_UNIQUE_CAR_IDS_LOOKUP,
      'feedback',
      'warn',
      'Car cannot be deleted by player',
    );

    return [
      makeItemList('Credit Rewards', inventory.creditRewards),
      carsWithWarnings,
      makeItemList('Vanity Items', inventory.vanityItems),
      makeItemList('Car Horns', inventory.carHorns),
      makeItemList('Quick Chat Lines', inventory.quickChatLines),
      makeItemList('Emotes', inventory.emotes),
    ];
  }
}
