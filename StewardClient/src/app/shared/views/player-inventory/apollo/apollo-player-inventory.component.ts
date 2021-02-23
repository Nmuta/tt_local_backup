import { Component } from '@angular/core';
import { ApolloMasterInventory } from '@models/apollo';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { ApolloService } from '@services/apollo';
import { Observable } from 'rxjs';
import {
  PlayerInventoryBaseComponent,
  PropertyToExpandoData,
} from '../player-inventory.base.component';

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
  protected getPlayerInventoryByIdentity(
    identity: IdentityResultAlpha,
  ): Observable<ApolloMasterInventory> {
    return this.apollo.getPlayerInventoryByXuid(identity.xuid);
  }

  /** Implement to specify the expando tables to show. */
  protected makeWhatToShow(): PropertyToExpandoData<ApolloMasterInventory>[] {
    return [
      this.makeEntry('creditRewards', 'Credit Rewards'),
      this.makeEntry('cars', 'Cars'),
      this.makeEntry('vanityItems', 'Vanity Items'),
    ];
  }
}
