import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { WoodstockMasterInventory } from '@models/woodstock';
import { WoodstockService } from '@services/woodstock';
import { Observable } from 'rxjs';
import { PlayerInventoryBaseComponent } from '../player-inventory.base.component';
import { PlayerInventoryItemList } from '@models/master-inventory-item-list';
import { GameTitle } from '@models/enums';
import { WOODSTOCK_UNIQUE_CAR_IDS_LOOKUP } from '@environments/app-data/item-lists/woodstock-special-cars';

/** Displays a Woodstock player's inventory. */
@Component({
  selector: 'woodstock-player-inventory',
  templateUrl: '../player-inventory.component.html',
  styleUrls: ['../player-inventory.component.scss'],
})
export class WoodstockPlayerInventoryComponent extends PlayerInventoryBaseComponent<
  WoodstockMasterInventory,
  IdentityResultAlpha
> {
  public gameTitle = GameTitle.FH5;

  constructor(private readonly woodstock: WoodstockService) {
    super();
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerInventoryByIdentity$(
    identity: IdentityResultAlpha,
  ): Observable<WoodstockMasterInventory> {
    return this.woodstock.getPlayerInventoryByXuid$(identity.xuid);
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerInventoryByIdentityAndProfileId$(
    _identity: IdentityResultAlpha,
    profileId: BigNumber,
  ): Observable<WoodstockMasterInventory> {
    return this.woodstock.getPlayerInventoryByProfileId$(profileId);
  }

  /** Implement to specify the expando tables to show. */
  protected makewhatToShowList(): PlayerInventoryItemList[] {
    const cars = this.makeItemList('Cars', this.inventory.cars);
    const carsWithWarnings = this.addWarnings(
      cars,
      WOODSTOCK_UNIQUE_CAR_IDS_LOOKUP,
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
