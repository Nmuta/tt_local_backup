import { Component, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BackgroundJob } from '@models/background-job';
import { GameTitleCodeName } from '@models/enums';
import { GiftResponse } from '@models/gift-response';
import { GravityGift, GravityPlayerInventory } from '@models/gravity';
import { GravityMasterInventoryLists } from '@models/gravity/gravity-master-inventory-list.model';
import { IdentityResultBeta } from '@models/identity-query.model';
import { MasterInventoryItem } from '@models/master-inventory-item';
import { Store } from '@ngxs/store';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { GravityService } from '@services/gravity';
import { GetGravityMasterInventoryList } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.actions';
import { MasterInventoryListMemoryState } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.state';
import { Observable, throwError } from 'rxjs';
import { GiftBasketBaseComponent } from '../gift-basket.base.component';

/** Gravity gift basket. */
@Component({
  selector: 'gravity-gift-basket',
  templateUrl: '../gift-basket.component.html',
  styleUrls: ['../gift-basket.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GravityGiftBasketComponent),
      multi: true,
    },
  ],
})
export class GravityGiftBasketComponent
  extends GiftBasketBaseComponent<IdentityResultBeta>
  implements OnChanges {
  @Input() public playerInventory: GravityPlayerInventory;

  public title = GameTitleCodeName.Street;
  public hasGameSettings: boolean = true;

  constructor(
    protected readonly backgroundJobService: BackgroundJobService,
    protected readonly gravityService: GravityService,
    protected readonly store: Store,
    protected readonly formBuilder: FormBuilder,
  ) {
    super(backgroundJobService, formBuilder);
  }

  /** Angular lifecycle */
  public ngOnChanges(changes: SimpleChanges): void {
    if (!!changes?.playerInventory?.currentValue) {
      this.isLoading = true;
      const gameSettings = this.playerInventory.previousGameSettingsId;
      this.store.dispatch(new GetGravityMasterInventoryList(gameSettings)).subscribe(() => {
        this.isLoading = false;
        const gravityMasterInventory = this.store.selectSnapshot<GravityMasterInventoryLists>(
          MasterInventoryListMemoryState.gravityMasterInventory,
        );
        this.masterInventory = gravityMasterInventory[gameSettings];

        // TODO: When a valid game settings updates the masterInventory, we need to verify the existing contents of a gift basket
        // in relation to the new master inventory (show item errors & disallow gift send while there are errors)
      });
    } else {
      this.masterInventory = undefined;
      // TODO:When no/ bad game settings, we need to show show errors for all items in the gift basket and disallow gift send
    }
  }

  /** Generates a gravity gift from the gift basket. */
  public generateGiftInventoryFromGiftBasket(): GravityGift {
    const giftBasketItems = this.giftBasket.data;
    return {
      giftReason: this.sendGiftForm.controls['giftReason'].value,
      inventory: {
        creditRewards: giftBasketItems
          .filter(item => item.itemType === 'creditRewards')
          .map(item => item as MasterInventoryItem),
        cars: giftBasketItems
          .filter(item => item.itemType === 'cars')
          .map(item => item as MasterInventoryItem),
        repairKits: giftBasketItems
          .filter(item => item.itemType === 'repairKits')
          .map(item => item as MasterInventoryItem),
        masteryKits: giftBasketItems
          .filter(item => item.itemType === 'masteryKits')
          .map(item => item as MasterInventoryItem),
        upgradeKits: giftBasketItems
          .filter(item => item.itemType === 'upgradeKits')
          .map(item => item as MasterInventoryItem),
        energyRefills: giftBasketItems
          .filter(item => item.itemType === 'energyRefills')
          .map(item => item as MasterInventoryItem),
      },
    };
  }

  /** Sends a gravity gift to players. */
  public sendGiftToPlayers(gift: GravityGift): Observable<BackgroundJob<void>> {
    const t10Id = this.playerIdentities[0].t10Id;
    return this.gravityService.postGiftPlayerUsingBackgroundTask(t10Id, gift);
  }

  /** Sends a gravity gift to an LSP group. */
  public sendGiftToLspGroup(_gift: GravityGift): Observable<GiftResponse<bigint>> {
    return throwError('Gravity does not support LSP gifting.');
  }
}
