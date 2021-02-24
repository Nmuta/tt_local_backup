import { Component } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SunriseMasterInventory } from '@models/sunrise';
import { SunriseService } from '@services/sunrise';
import { Observable } from 'rxjs';
import {
  PlayerInventoryBaseComponent,
  PropertyToExpandoData,
} from '../player-inventory.base.component';

/** Displays a Sunrise player's inventory. */
@Component({
  selector: 'sunrise-player-inventory',
  templateUrl: '../player-inventory.component.html',
  styleUrls: ['../player-inventory.component.scss'],
})
export class SunrisePlayerInventoryComponent extends PlayerInventoryBaseComponent<
  SunriseMasterInventory,
  IdentityResultAlpha
> {
  constructor(private readonly sunrise: SunriseService) {
    super();
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerInventoryByIdentity(
    identity: IdentityResultAlpha,
  ): Observable<SunriseMasterInventory> {
    return this.sunrise.getPlayerInventoryByXuid(identity.xuid);
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerInventoryByIdentityAndProfileId(
    _identity: IdentityResultAlpha,
    profileId: bigint,
  ): Observable<SunriseMasterInventory> {
    return this.sunrise.getPlayerInventoryByProfileId(profileId);
  }

  /** Implement to specify the expando tables to show. */
  protected makeWhatToShow(): PropertyToExpandoData<SunriseMasterInventory>[] {
    return [
      this.makeEntry('creditRewards', 'Credit Rewards'),
      this.makeEntry('cars', 'Cars'),
      this.makeEntry('vanityItems', 'Vanity Items'),
      this.makeEntry('carHorns', 'Car Horns'),
      this.makeEntry('quickChatLines', 'Quick Chat Lines'),
      this.makeEntry('emotes', 'Emotes'),
    ];
  }
}
