import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { SteelheadMasterInventory } from '@models/steelhead';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { Observable } from 'rxjs';
import { PlayerInventoryBaseComponent } from '../player-inventory.base.component';
import { PlayerInventoryItemList } from '@models/master-inventory-item-list';
import { GameTitle } from '@models/enums';
import { SteelheadPlayerInventoryService } from '@services/api-v2/steelhead/player/inventory/steelhead-player-inventory.service';
import { SteelheadInventoryService } from '@services/api-v2/steelhead/inventory/steelhead-inventory.service';

/** Displays an Steelhead player's inventory. */
@Component({
  selector: 'steelhead-player-inventory',
  templateUrl: '../player-inventory.component.html',
  styleUrls: ['../player-inventory.component.scss'],
})
export class SteelheadPlayerInventoryComponent extends PlayerInventoryBaseComponent<
  SteelheadMasterInventory,
  IdentityResultAlpha
> {
  public gameTitle = GameTitle.FM8;

  constructor(
    private readonly inventoryService: SteelheadInventoryService,
    private readonly playerInventoryService: SteelheadPlayerInventoryService,
  ) {
    super();
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerInventoryByIdentity$(
    identity: IdentityResultAlpha,
  ): Observable<SteelheadMasterInventory> {
    return this.playerInventoryService.getInventoryByXuid$(identity.xuid);
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerInventoryByIdentityAndProfileId$(
    _identity: IdentityResultAlpha,
    profileId: BigNumber,
  ): Observable<SteelheadMasterInventory> {
    return this.inventoryService.getInventoryByProfileId$(profileId);
  }

  /** Implement to specify the expando tables to show. */
  protected makewhatToShowList(): PlayerInventoryItemList[] {
    return [
      this.makeItemList('Credit Rewards', this.inventory.creditRewards),
      this.makeItemList('Cars', this.inventory.cars),
      this.makeItemList('Vanity Items', this.inventory.vanityItems),
    ];
  }
}
