import BigNumber from 'bignumber.js';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { OpusMasterInventory } from '@models/opus';
import { OpusService } from '@services/opus';
import { PlayerInventoryItemList } from '@models/master-inventory-item-list';
import { GameTitle } from '@models/enums';
import { makeItemList } from '../player-inventory-helpers';
import { PlayerInventoryComponentContract } from '../player-inventory.component';

/** Displays an Opus player's inventory. */
@Component({
  selector: 'opus-player-inventory',
  templateUrl: './opus-player-inventory.component.html',
  styleUrls: ['./opus-player-inventory.component.scss'],
})
export class OpusPlayerInventoryComponent {
  /** Player Identity. */
  @Input() public identity: IdentityResultAlpha;
  /** Inventory profile Id. */
  @Input() public profileId: BigNumber | string | undefined | null;
  /** Outputs when player inventory is found. */
  @Output() public inventoryFound = new EventEmitter<OpusMasterInventory>();

  public service: PlayerInventoryComponentContract<OpusMasterInventory, IdentityResultAlpha>;

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
  protected makewhatToShowList(inventory: OpusMasterInventory): PlayerInventoryItemList[] {
    return [
      makeItemList('Credit Rewards', inventory.creditRewards),
      makeItemList('Cars', inventory.cars),
    ];
  }
}
