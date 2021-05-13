import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { OpusMasterInventory } from '@models/opus';
import { OpusService } from '@services/opus';
import { Observable } from 'rxjs';
import { PlayerInventoryBaseComponent } from '../player-inventory.base.component';
import { PlayerInventoryItemList } from '@models/master-inventory-item-list';

/** Displays an Opus player's inventory. */
@Component({
  selector: 'opus-player-inventory',
  templateUrl: '../player-inventory.component.html',
  styleUrls: ['../player-inventory.component.scss'],
})
export class OpusPlayerInventoryComponent extends PlayerInventoryBaseComponent<
  OpusMasterInventory,
  IdentityResultAlpha
> {
  constructor(private readonly opus: OpusService) {
    super();
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerInventoryByIdentity$(
    identity: IdentityResultAlpha,
  ): Observable<OpusMasterInventory> {
    return this.opus.getPlayerInventoryByXuid$(identity.xuid);
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerInventoryByIdentityAndProfileId$(
    _identity: IdentityResultAlpha,
    profileId: BigNumber,
  ): Observable<OpusMasterInventory> {
    return this.opus.getPlayerInventoryByProfileId$(profileId);
  }

  /** Implement to specify the expando tables to show. */
  protected makewhatToShowList(): PlayerInventoryItemList[] {
    return [
      this.makeItemList('Credit Rewards', this.inventory.creditRewards),
      this.makeItemList('Cars', this.inventory.cars),
    ];
  }
}
