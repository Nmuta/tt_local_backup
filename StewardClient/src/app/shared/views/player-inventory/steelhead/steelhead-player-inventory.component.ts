import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SteelheadMasterInventory } from '@models/steelhead';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { PlayerInventoryItemList } from '@models/master-inventory-item-list';
import { GameTitle } from '@models/enums';
import { SteelheadPlayerInventoryService } from '@services/api-v2/steelhead/player/inventory/steelhead-player-inventory.service';
import { SteelheadInventoryService } from '@services/api-v2/steelhead/inventory/steelhead-inventory.service';
import { PlayerInventoryComponentContract } from '../player-inventory.component';
import BigNumber from 'bignumber.js';
import { makeItemList } from '../player-inventory-helpers';

/** Displays an Steelhead player's inventory. */
@Component({
  selector: 'steelhead-player-inventory',
  templateUrl: './steelhead-player-inventory.component.html',
  styleUrls: ['./steelhead-player-inventory.component.scss'],
})
export class SteelheadPlayerInventoryComponent {
  /** Player Identity. */
  @Input() public identity: IdentityResultAlpha;
  /** Inventory profile Id. */
  @Input() public profileId: BigNumber | string | undefined | null;
  /** Outputs when player inventory is found. */
  @Output() public inventoryFound = new EventEmitter<SteelheadMasterInventory>();

  public service: PlayerInventoryComponentContract<SteelheadMasterInventory, IdentityResultAlpha>;

  constructor(
    private readonly inventoryService: SteelheadInventoryService,
    private readonly playerInventoryService: SteelheadPlayerInventoryService,
  ) {
    this.service = {
      gameTitle: GameTitle.FM8,
      getPlayerInventoryByIdentity$: identity =>
        this.playerInventoryService.getInventoryByXuid$(identity.xuid),
      getPlayerInventoryByIdentityAndProfileId$: (_identity, profileId) =>
        this.inventoryService.getInventoryByProfileId$(profileId as BigNumber),
      makewhatToShowList: inventory => this.makewhatToShowList(inventory),
      inventoryFound: inventory => this.inventoryFound.emit(inventory),
    };
  }

  /** Implement to specify the expando tables to show. */
  protected makewhatToShowList(inventory: SteelheadMasterInventory): PlayerInventoryItemList[] {
    return [
      makeItemList('Credit Rewards', inventory.creditRewards),
      makeItemList('Cars', inventory.cars),
      makeItemList('Vanity Items', inventory.vanityItems),
    ];
  }
}
