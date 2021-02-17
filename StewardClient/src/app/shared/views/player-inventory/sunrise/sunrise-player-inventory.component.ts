import { Component } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SunrisePlayerInventory } from '@models/sunrise';
import { SunriseInventoryItem } from '@models/sunrise/inventory-items';
import { SunriseService } from '@services/sunrise';
import { Observable } from 'rxjs';
import {
  PlayerInventoryBaseComponent,
  PropertyToExpandoData,
} from '../player-inventory.base.component';

/** Displays a Sunrise player's inventory. */
@Component({
  selector: 'sunrise-player-inventory',
  templateUrl: './sunrise-player-inventory.component.html',
  styleUrls: ['./sunrise-player-inventory.component.scss'],
})
export class SunrisePlayerInventoryComponent extends PlayerInventoryBaseComponent<
  SunrisePlayerInventory,
  SunriseInventoryItem,
  IdentityResultAlpha
> {
  constructor(private readonly sunrise: SunriseService) {
    super();
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerInventoryByIdentity(
    identity: IdentityResultAlpha,
  ): Observable<SunrisePlayerInventory> {
    return this.sunrise.getPlayerInventoryByXuid(identity.xuid);
  }

  /** Implement to specify the expando tables to show. */
  protected makeWhatToShow(): PropertyToExpandoData<SunrisePlayerInventory>[] {
    return [
      this.makeEntry('cars', 'Cars'),
      this.makeEntry('vanityItems', 'Vanity Items'),
      this.makeEntry('carHorns', 'Car Horns'),
      this.makeEntry('quickChatLines', 'Quick Chat Lines'),
      this.makeEntry('emotes', 'Emotes'),
      this.makeEntry('rebuilds', 'Rebuilds'),
      this.makeEntry('creditRewards', 'Credit Rewards'),
      this.makeEntry('barnFindRumors', 'Barn Find Rumors'),
      this.makeEntry('perks', 'Perks'),
    ];
  }
}
