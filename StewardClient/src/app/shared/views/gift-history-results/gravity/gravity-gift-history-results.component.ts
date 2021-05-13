import { Component } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { GravityGiftHistory } from '@models/gravity';
import { IdentityResultBeta } from '@models/identity-query.model';
import { MasterInventoryItemList } from '@models/master-inventory-item-list';
import { GravityService } from '@services/gravity';
import { Observable, throwError } from 'rxjs';
import {
  GiftHistoryDescription,
  GiftHistoryResultsBaseComponent,
} from '../gift-history-results.base.component';

/** Retreives and displays Gravity Gift history by XUID. */
@Component({
  selector: 'gravity-gift-history-results',
  templateUrl: '../gift-history-results.component.html',
  styleUrls: ['../gift-history-results.base.component.scss'],
})
export class GravityGiftHistoryResultsComponent extends GiftHistoryResultsBaseComponent<
  IdentityResultBeta,
  GravityGiftHistory
> {
  public gameTitle = GameTitleCodeName.Street;

  constructor(private readonly gravity: GravityService) {
    super();
  }

  /** Reteives the gift history of the player. */
  public retrieveHistoryByPlayer$(): Observable<GravityGiftHistory[]> {
    return this.gravity.getGiftHistoryByT10Id$(this.selectedPlayer.t10Id);
  }

  /** Reteives the gift history of a LSP group. */
  public retrieveHistoryByLspGroup$(): Observable<GravityGiftHistory[]> {
    return throwError('LSP Group Gifting not supported for Gravity.');
  }

  /** Generates the gift history item list to display for each gift history entry. */
  public generateItemsList(giftHistory: GravityGiftHistory): MasterInventoryItemList[] {
    return [
      this.makeItemList('Credit Rewards', giftHistory.giftInventory.inventory.creditRewards),
      this.makeItemList('Cars', giftHistory.giftInventory.inventory.cars),
      this.makeItemList('Energy Refills', giftHistory.giftInventory.inventory.energyRefills),
      this.makeItemList('Mastery Kits', giftHistory.giftInventory.inventory.masteryKits),
      this.makeItemList('Repair Kits', giftHistory.giftInventory.inventory.repairKits),
      this.makeItemList('Upgrade Kits', giftHistory.giftInventory.inventory.upgradeKits),
    ];
  }

  /** Generates the gift history description list to display for each gift history entry. */
  public generateDescriptionList(giftHistory: GravityGiftHistory): GiftHistoryDescription[] {
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
      inventory.energyRefills?.length > 0
        ? { title: 'Energy Refills', quantity: inventory.energyRefills?.length }
        : undefined,
    );
    descriptionList.push(
      inventory.masteryKits?.length > 0
        ? { title: 'Mastery Kits', quantity: inventory.masteryKits?.length }
        : undefined,
    );
    descriptionList.push(
      inventory.repairKits?.length > 0
        ? { title: 'Repair Kits', quantity: inventory.repairKits?.length }
        : undefined,
    );
    descriptionList.push(
      inventory.upgradeKits?.length > 0
        ? { title: 'Upgrade Kits', quantity: inventory.upgradeKits?.length }
        : undefined,
    );

    descriptionList = descriptionList.filter(desc => !!desc);
    return descriptionList;
  }
}
