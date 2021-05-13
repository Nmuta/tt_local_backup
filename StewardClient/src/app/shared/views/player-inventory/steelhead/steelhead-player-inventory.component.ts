import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { SteelheadMasterInventory } from '@models/steelhead';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SteelheadService } from '@services/steelhead';
import { Observable } from 'rxjs';
import { PlayerInventoryBaseComponent } from '../player-inventory.base.component';
import { MasterInventoryItemList } from '@models/master-inventory-item-list';

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
  constructor(private readonly steelhead: SteelheadService) {
    super();
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerInventoryByIdentity$(
    identity: IdentityResultAlpha,
  ): Observable<SteelheadMasterInventory> {
    return this.steelhead.getPlayerInventoryByXuid$(identity.xuid);
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerInventoryByIdentityAndProfileId$(
    _identity: IdentityResultAlpha,
    profileId: BigNumber,
  ): Observable<SteelheadMasterInventory> {
    return this.steelhead.getPlayerInventoryByProfileId$(profileId);
  }

  /** Implement to specify the expando tables to show. */
  protected makewhatToShowList(): MasterInventoryItemList[] {
    return [
      this.makeItemList('Credit Rewards', this.inventory.creditRewards),
      this.makeItemList('Cars', this.inventory.cars),
      this.makeItemList('Vanity Items', this.inventory.vanityItems),
    ];
  }
}
