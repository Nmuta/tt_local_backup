import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SunriseMasterInventory } from '@models/sunrise';
import { SunriseService } from '@services/sunrise';
import { Observable } from 'rxjs';
import { PlayerInventoryBaseComponent } from '../player-inventory.base.component';
import { PlayerInventoryItemList } from '@models/master-inventory-item-list';
import { GameTitle } from '@models/enums';
import { SUNRISE_UNIQUE_CAR_IDS_LOOKUP } from '@environments/app-data/item-lists/sunrise-special-cars';

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
  public gameTitle = GameTitle.FH4;

  constructor(private readonly sunrise: SunriseService) {
    super();
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerInventoryByIdentity$(
    identity: IdentityResultAlpha,
  ): Observable<SunriseMasterInventory> {
    return this.sunrise.getPlayerInventoryByXuid$(identity.xuid);
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerInventoryByIdentityAndProfileId$(
    _identity: IdentityResultAlpha,
    profileId: BigNumber,
  ): Observable<SunriseMasterInventory> {
    return this.sunrise.getPlayerInventoryByProfileId$(profileId);
  }

  /** Implement to specify the expando tables to show. */
  protected makewhatToShowList(): PlayerInventoryItemList[] {
    const cars = this.makeItemList('Cars', this.inventory.cars);
    const carsWithWarnings = this.addWarnings(
      cars,
      SUNRISE_UNIQUE_CAR_IDS_LOOKUP,
      'feedback',
      'warn',
      'Car cannot be deleted by player',
    );
    return [
      this.makeItemList('Credit Rewards', this.inventory.creditRewards),
      carsWithWarnings,
      this.makeItemList('Vanity Items', this.inventory.vanityItems),
      this.makeItemList('Car Horns', this.inventory.carHorns),
      this.makeItemList('Quick Chat Lines', this.inventory.quickChatLines),
      this.makeItemList('Emotes', this.inventory.emotes),
    ];
  }
}
