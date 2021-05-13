import { Component } from '@angular/core';
import { SteelheadGiftHistory } from '@models/steelhead';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { MasterInventoryItemList } from '@models/master-inventory-item-list';
import { SteelheadService } from '@services/steelhead/steelhead.service';
import { Observable } from 'rxjs';
import {
  GiftHistoryDescription,
  GiftHistoryResultsBaseComponent,
} from '../gift-history-results.base.component';

/** Retreives and displays Steelhead Gift history. */
@Component({
  selector: 'steelhead-gift-history-results',
  templateUrl: '../gift-history-results.component.html',
  styleUrls: ['../gift-history-results.base.component.scss'],
})
export class SteelheadGiftHistoryResultsComponent extends GiftHistoryResultsBaseComponent<
  IdentityResultAlpha,
  SteelheadGiftHistory
> {
  public gameTitle = GameTitleCodeName.FM8;

  constructor(private readonly steelheadService: SteelheadService) {
    super();
  }

  /** Reteives the gift history of the player. */
  public retrieveHistoryByPlayer$(): Observable<SteelheadGiftHistory[]> {
    return this.steelheadService.getGiftHistoryByXuid$(this.selectedPlayer.xuid);
  }

  /** Reteives the gift history of a LSP group. */
  public retrieveHistoryByLspGroup$(): Observable<SteelheadGiftHistory[]> {
    return this.steelheadService.getGiftHistoryByLspGroup$(this.selectedGroup.id);
  }

  /** Generates the gift history item list to display for each gift history entry. */
  public generateItemsList(giftHistory: SteelheadGiftHistory): MasterInventoryItemList[] {
    return [
      this.makeItemList('Credit Rewards', giftHistory.giftInventory.inventory.creditRewards),
      this.makeItemList('Cars', giftHistory.giftInventory.inventory.cars),
      this.makeItemList('Vanity Items', giftHistory.giftInventory.inventory.vanityItems),
    ];
  }

  /** Generates the gift history description list to display for each gift history entry. */
  public generateDescriptionList(giftHistory: SteelheadGiftHistory): GiftHistoryDescription[] {
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

    descriptionList = descriptionList.filter(desc => !!desc);
    return descriptionList;
  }
}
