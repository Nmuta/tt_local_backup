import { Component } from '@angular/core';
import { ApolloPlayerInventory } from '@models/apollo';
import { ApolloInventoryItem } from '@models/apollo/inventory-items';
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
  templateUrl: './apollo-player-inventory.component.html',
  styleUrls: ['./apollo-player-inventory.component.scss'],
})
export class ApolloPlayerInventoryComponent extends PlayerInventoryBaseComponent<
  ApolloPlayerInventory,
  ApolloInventoryItem,
  IdentityResultAlpha
> {
  constructor(private readonly apollo: ApolloService) {
    super();
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerInventoryByIdentity(
    identity: IdentityResultAlpha,
  ): Observable<ApolloPlayerInventory> {
    return this.apollo.getPlayerInventoryByXuid(identity.xuid);
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerInventoryByIdentityAndProfileId(
    _identity: IdentityResultAlpha,
    profileId: bigint,
  ): Observable<ApolloPlayerInventory> {
    return this.apollo.getPlayerInventoryByProfileId(profileId);
  }

  /** Implement to specify the expando tables to show. */
  protected makeWhatToShow(): PropertyToExpandoData<ApolloPlayerInventory>[] {
    return [
      this.makeEntry('cars', 'Cars'),
      this.makeEntry('vanityItems', 'Vanity Items'),
      this.makeEntry('mods', 'Mods'),
      this.makeEntry('vanityItems', 'Vanity Items'),
      this.makeEntry('packs', 'Packs'),
      this.makeEntry('badges', 'Badges'),
    ];
  }
}
