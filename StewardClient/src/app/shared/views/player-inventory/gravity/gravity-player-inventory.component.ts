import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { GravityPlayerInventory } from '@models/gravity';
import { IdentityResultBeta } from '@models/identity-query.model';
import { GravityService } from '@services/gravity';
import { Observable } from 'rxjs';
import { PlayerInventoryBaseComponent } from '../player-inventory.base.component';
import { PlayerInventoryItemList } from '@models/master-inventory-item-list';

/** Displays a Gravity player's inventory. */
@Component({
  selector: 'gravity-player-inventory',
  templateUrl: '../player-inventory.component.html',
  styleUrls: ['../player-inventory.component.scss'],
})
export class GravityPlayerInventoryComponent extends PlayerInventoryBaseComponent<
  GravityPlayerInventory,
  IdentityResultBeta
> {
  constructor(private readonly gravity: GravityService) {
    super();
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerInventoryByIdentity$(
    identity: IdentityResultBeta,
  ): Observable<GravityPlayerInventory> {
    return this.gravity.getPlayerInventoryByT10Id$(identity.t10Id);
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerInventoryByIdentityAndProfileId$(
    identity: IdentityResultBeta,
    profileId: BigNumber,
  ): Observable<GravityPlayerInventory> {
    return this.gravity.getPlayerInventoryByT10IdAndProfileId$(identity.t10Id, profileId);
  }

  /** Implement to specify the expando tables to show. */
  protected makewhatToShowList(): PlayerInventoryItemList[] {
    return [
      this.makeItemList('Credit Rewards', this.inventory.creditRewards),
      this.makeItemList('Cars', this.inventory.cars),
      this.makeItemList('Mastery Kits', this.inventory.masteryKits),
      this.makeItemList('Energy Refills', this.inventory.energyRefills),
    ];
  }
}
