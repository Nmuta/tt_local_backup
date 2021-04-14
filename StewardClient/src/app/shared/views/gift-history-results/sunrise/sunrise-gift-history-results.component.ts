import { Component } from '@angular/core';
import { SunriseGiftHistory } from '@models/sunrise';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { Observable } from 'rxjs';
import {
  GiftHistoryDescription,
  GiftHistoryResultsBaseComponent,
} from '../gift-history-results.base.component';
import { MasterInventoryItemList } from '@models/master-inventory-item-list';
import { GameTitleCodeName } from '@models/enums';

/** Retreives and displays Sunrise Gift history by XUID. */
@Component({
  selector: 'sunrise-gift-history-results',
  templateUrl: '../gift-history-results.component.html',
  styleUrls: ['../gift-history-results.base.component.scss'],
})
export class SunriseGiftHistoryResultsComponent extends GiftHistoryResultsBaseComponent<
  IdentityResultAlpha,
  SunriseGiftHistory
> {
  public gameTitle = GameTitleCodeName.FH4;

  constructor(private readonly sunrise: SunriseService) {
    super();
  }

  /** Reteives the gift history of the player. */
  public retrieveHistoryByPlayer(): Observable<SunriseGiftHistory[]> {
    return this.sunrise.getGiftHistoryByXuid(this.selectedPlayer.xuid);
  }

  /** Reteives the gift history of a LSP group. */
  public retrieveHistoryByLspGroup(): Observable<SunriseGiftHistory[]> {
    return this.sunrise.getGiftHistoryByLspGroup(this.selectedGroup.id);
  }

  /** Generates the gift history item list to display for each gift history entry. */
  public generateItemsList(giftHistory: SunriseGiftHistory): MasterInventoryItemList[] {
    return [
      this.makeItemList('Credit Rewards', giftHistory.giftInventory.inventory.creditRewards),
      this.makeItemList('Cars', giftHistory.giftInventory.inventory.cars),
      this.makeItemList('Vanity Items', giftHistory.giftInventory.inventory.vanityItems),
      this.makeItemList('Car Horns', giftHistory.giftInventory.inventory.carHorns),
      this.makeItemList('Quick Chat Lines', giftHistory.giftInventory.inventory.quickChatLines),
      this.makeItemList('Emotes', giftHistory.giftInventory.inventory.emotes),
    ];
  }

  /** Generates the gift history description list to display for each gift history entry. */
  public generateDescriptionList(giftHistory: SunriseGiftHistory): GiftHistoryDescription[] {
    const inventory = giftHistory.giftInventory.inventory;
    let descriptionList: GiftHistoryDescription[] = [];
    descriptionList.push(
      inventory.creditRewards?.length > 0
        ? { title: 'Credit Rewards', quantity: inventory.creditRewards?.length }
        : undefined,
    );
    descriptionList.push(
      inventory.cars?.length > 0 ? { title: 'Cars', quantity: inventory.cars?.length } : undefined,
    );
    descriptionList.push(
      inventory.vanityItems?.length > 0
        ? { title: 'Vanity Items', quantity: inventory.vanityItems?.length }
        : undefined,
    );
    descriptionList.push(
      inventory.carHorns?.length > 0
        ? { title: 'Cars Horns', quantity: inventory.carHorns?.length }
        : undefined,
    );
    descriptionList.push(
      inventory.emotes?.length > 0
        ? { title: 'Emotes', quantity: inventory.emotes?.length }
        : undefined,
    );
    descriptionList.push(
      inventory.quickChatLines?.length > 0
        ? { title: 'Quick Chat Lines', quantity: inventory.quickChatLines?.length }
        : undefined,
    );

    descriptionList = descriptionList.filter(desc => !!desc);
    return descriptionList;
  }
}
