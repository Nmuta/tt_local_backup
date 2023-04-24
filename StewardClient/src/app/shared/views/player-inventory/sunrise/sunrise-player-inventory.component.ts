import BigNumber from 'bignumber.js';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SunriseMasterInventory } from '@models/sunrise';
import { SunriseService } from '@services/sunrise';
import { PlayerInventoryItemList } from '@models/master-inventory-item-list';
import { GameTitle } from '@models/enums';
import { SUNRISE_UNIQUE_CAR_IDS_LOOKUP } from '@environments/app-data/item-lists/sunrise-special-cars';
import { PlayerInventoryComponentContract } from '../player-inventory.component';
import { makeItemList, addWarnings } from '../player-inventory-helpers';

/** Displays a Sunrise player's inventory. */
@Component({
  selector: 'sunrise-player-inventory',
  templateUrl: './sunrise-player-inventory.component.html',
  styleUrls: ['./sunrise-player-inventory.component.scss'],
})
export class SunrisePlayerInventoryComponent {
  /** Player Identity. */
  @Input() public identity: IdentityResultAlpha;
  /** Inventory profile Id. */
  @Input() public profileId: BigNumber | string | undefined | null;
  /** Outputs when player inventory is found. */
  @Output() public inventoryFound = new EventEmitter<SunriseMasterInventory>();

  public service: PlayerInventoryComponentContract<SunriseMasterInventory, IdentityResultAlpha>;

  constructor(private readonly sunrise: SunriseService) {
    this.service = {
      gameTitle: GameTitle.FH4,
      getPlayerInventoryByIdentity$: identity =>
        this.sunrise.getPlayerInventoryByXuid$(identity.xuid),
      getPlayerInventoryByIdentityAndProfileId$: (_identity, profileId) =>
        this.sunrise.getPlayerInventoryByProfileId$(profileId as BigNumber),
      makewhatToShowList: inventory => this.makewhatToShowList(inventory),
      inventoryFound: inventory => this.inventoryFound.emit(inventory),
    };
  }

  /** Implement to specify the expando tables to show. */
  protected makewhatToShowList(inventory: SunriseMasterInventory): PlayerInventoryItemList[] {
    const cars = makeItemList('Cars', inventory.cars);
    const carsWithWarnings = addWarnings(
      cars,
      SUNRISE_UNIQUE_CAR_IDS_LOOKUP,
      'feedback',
      'warn',
      'Car cannot be deleted by player',
    );
    return [
      makeItemList('Credit Rewards', inventory.creditRewards),
      carsWithWarnings,
      makeItemList('Vanity Items', inventory.vanityItems),
      makeItemList('Car Horns', inventory.carHorns),
      makeItemList('Quick Chat Lines', inventory.quickChatLines),
      makeItemList('Emotes', inventory.emotes),
    ];
  }
}
