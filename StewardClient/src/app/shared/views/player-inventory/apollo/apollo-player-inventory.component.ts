import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { ApolloMasterInventory } from '@models/apollo';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { ApolloService } from '@services/apollo';
import { Observable } from 'rxjs';
import { PlayerInventoryBaseComponent } from '../player-inventory.base.component';
import { PlayerInventoryItemList } from '@models/master-inventory-item-list';

/** Displays an Apollo player's inventory. */
@Component({
  selector: 'apollo-player-inventory',
  templateUrl: '../player-inventory.component.html',
  styleUrls: ['../player-inventory.component.scss'],
})
export class ApolloPlayerInventoryComponent extends PlayerInventoryBaseComponent<
  ApolloMasterInventory,
  IdentityResultAlpha
> {
  constructor(private readonly apollo: ApolloService) {
    super();
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerInventoryByIdentity$(
    identity: IdentityResultAlpha,
  ): Observable<ApolloMasterInventory> {
    return this.apollo.getPlayerInventoryByXuid$(identity.xuid);
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerInventoryByIdentityAndProfileId$(
    _identity: IdentityResultAlpha,
    profileId: BigNumber,
  ): Observable<ApolloMasterInventory> {
    return this.apollo.getPlayerInventoryByProfileId$(profileId);
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
