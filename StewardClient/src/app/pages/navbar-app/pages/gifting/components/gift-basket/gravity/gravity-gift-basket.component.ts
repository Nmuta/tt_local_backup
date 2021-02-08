import { Component, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GameTitleCodeName } from '@models/enums';
import { GravityGift, GravityPlayerInventory } from '@models/gravity';
import { GravityMasterInventoryLists } from '@models/gravity/gravity-master-inventory-list.model';
import { IdentityResultBeta } from '@models/identity-query.model';
import { MasterInventoryItem } from '@models/master-inventory-item';
import { Store } from '@ngxs/store';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { GravityService } from '@services/gravity';
import { GetGravityMasterInventoryList } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.actions';
import { MasterInventoryListMemoryState } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.state';
import { NEVER } from 'rxjs';
import { catchError, take, takeUntil, tap } from 'rxjs/operators';
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

  /** Sends the gift basket. */
  public sendGiftBasket(): void {
    this.isLoading = true;
    const giftBasketItems = this.giftBasket.data;
    const gift: GravityGift = {
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

    this.gravityService
      .postGiftPlayerUsingBackgroundTask(this.playerIdentities[0].t10Id, gift)
      .pipe(
        takeUntil(this.onDestroy$),
        catchError(error => {
          this.loadError = error;
          this.isLoading = false;
          return NEVER;
        }),
        take(1),
        tap(jobId => {
          this.waitForBackgroundJobToComplete(jobId);
        }),
      )
      .subscribe();
  }
}
