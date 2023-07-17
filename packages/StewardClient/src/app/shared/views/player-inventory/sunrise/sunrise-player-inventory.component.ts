import BigNumber from 'bignumber.js';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SunriseMasterInventory } from '@models/sunrise';
import { SunriseService } from '@services/sunrise';
import { PlayerInventoryItemListWithService } from '@models/master-inventory-item-list';
import { GameTitle } from '@models/enums';
import { SUNRISE_UNIQUE_CAR_IDS_LOOKUP } from '@environments/app-data/item-lists/sunrise-special-cars';
import { PlayerInventoryComponentContract } from '../player-inventory.component';
import { makeItemList, addWarnings } from '../player-inventory-helpers';
import { InventoryItemListDisplayComponentContract } from '@views/inventory-item-list-display/inventory-item-list-display.component';
import { PlayerInventoryProfileWithDeviceType } from '@models/player-inventory-profile';

/** Displays a Sunrise player's inventory. */
@Component({
  selector: 'sunrise-player-inventory',
  templateUrl: './sunrise-player-inventory.component.html',
  styleUrls: ['./sunrise-player-inventory.component.scss'],
})
export class SunrisePlayerInventoryComponent {
  /** Player Identity. */
  @Input() public identity: IdentityResultAlpha;
  /** Inventory profile. */
  @Input() public profile: PlayerInventoryProfileWithDeviceType;
  /** Outputs when player inventory is found. */
  @Output() public inventoryFound = new EventEmitter<SunriseMasterInventory>();

  public service: PlayerInventoryComponentContract<SunriseMasterInventory, IdentityResultAlpha>;

  public emptyInventoryItemListService: InventoryItemListDisplayComponentContract = {
    openCarEditModal$: undefined,
    editItemQuantity$: undefined,
    deleteItem$: undefined,
  };

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
  protected makewhatToShowList(
    inventory: SunriseMasterInventory,
  ): PlayerInventoryItemListWithService[] {
    const cars = addWarnings(
      makeItemList('Cars', inventory.cars),
      SUNRISE_UNIQUE_CAR_IDS_LOOKUP,
      'feedback',
      'warn',
      'Car cannot be deleted by player',
    ) as PlayerInventoryItemListWithService;

    const credits = makeItemList(
      'Credit Rewards',
      inventory.creditRewards,
    ) as PlayerInventoryItemListWithService;
    const vanityItems = makeItemList(
      'Vanity Items',
      inventory.vanityItems,
    ) as PlayerInventoryItemListWithService;
    const carHorns = makeItemList(
      'Car Horns',
      inventory.carHorns,
    ) as PlayerInventoryItemListWithService;
    const quickChatLines = makeItemList(
      'Quick Chat Lines',
      inventory.quickChatLines,
    ) as PlayerInventoryItemListWithService;
    const emotes = makeItemList('Emotes', inventory.emotes) as PlayerInventoryItemListWithService;

    credits.service = this.emptyInventoryItemListService;
    cars.service = this.emptyInventoryItemListService;
    vanityItems.service = this.emptyInventoryItemListService;
    carHorns.service = this.emptyInventoryItemListService;
    quickChatLines.service = this.emptyInventoryItemListService;
    emotes.service = this.emptyInventoryItemListService;

    return [credits, cars, vanityItems, carHorns, quickChatLines, emotes];
  }
}
