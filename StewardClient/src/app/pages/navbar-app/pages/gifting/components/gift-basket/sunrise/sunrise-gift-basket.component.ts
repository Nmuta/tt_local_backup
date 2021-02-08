import { Component, forwardRef, OnInit } from '@angular/core';
import { FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultBeta } from '@models/identity-query.model';
import { MasterInventoryItem } from '@models/master-inventory-item';
import { SunriseGift, SunriseGroupGift } from '@models/sunrise';
import { SunriseMasterInventory } from '@models/sunrise/sunrise-master-inventory.model';
import { Store } from '@ngxs/store';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { SunriseService } from '@services/sunrise';
import { GetSunriseMasterInventoryList } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.actions';
import { MasterInventoryListMemoryState } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.state';
import { NEVER } from 'rxjs';
import { catchError, take, takeUntil, tap } from 'rxjs/operators';
import { GiftBasketBaseComponent } from '../gift-basket.base.component';

/** Sunrise gift basket. */
@Component({
  selector: 'sunrise-gift-basket',
  templateUrl: '../gift-basket.component.html',
  styleUrls: ['../gift-basket.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SunriseGiftBasketComponent),
      multi: true,
    },
  ],
})
export class SunriseGiftBasketComponent
  extends GiftBasketBaseComponent<IdentityResultBeta>
  implements OnInit {
  public title = GameTitleCodeName.FH4;

  constructor(
    protected readonly backgroundJobService: BackgroundJobService,
    protected readonly sunriseService: SunriseService,
    protected readonly store: Store,
    protected readonly formBuilder: FormBuilder,
  ) {
    super(backgroundJobService, formBuilder);
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.isLoading = true;
    this.store.dispatch(new GetSunriseMasterInventoryList()).subscribe(() => {
      this.isLoading = false;
      const sunriseMasterInventory = this.store.selectSnapshot<SunriseMasterInventory>(
        MasterInventoryListMemoryState.sunriseMasterInventory,
      );
      this.masterInventory = sunriseMasterInventory;
    });
  }

  /** Sends the gift basket. */
  public sendGiftBasket(): void {
    this.isLoading = true;
    const giftBasketItems = this.giftBasket.data;
    const gift: SunriseGift = {
      giftReason: this.sendGiftForm.controls['giftReason'].value,
      inventory: {
        creditRewards: giftBasketItems
          .filter(item => item.itemType === 'creditRewards')
          .map(item => item as MasterInventoryItem),
        cars: giftBasketItems
          .filter(item => item.itemType === 'cars')
          .map(item => item as MasterInventoryItem),
        vanityItems: giftBasketItems
          .filter(item => item.itemType === 'vanityItems')
          .map(item => item as MasterInventoryItem),
        carHorns: giftBasketItems
          .filter(item => item.itemType === 'carHorns')
          .map(item => item as MasterInventoryItem),
        quickChatLines: giftBasketItems
          .filter(item => item.itemType === 'quickChatLines')
          .map(item => item as MasterInventoryItem),
        emotes: giftBasketItems
          .filter(item => item.itemType === 'emotes')
          .map(item => item as MasterInventoryItem),
      },
    };

    // If gifting to players, we are using background jobs
    if (this.usingPlayerIdentities) {
      const groupGift = gift as SunriseGroupGift;
      groupGift.xuids = this.playerIdentities
        .filter(player => !player.error)
        .map(player => player.xuid);
      this.sunriseService
        .postGiftPlayersUsingBackgroundTask(groupGift)
        .pipe(
          takeUntil(this.onDestroy$),
          catchError(error => {
            console.log('ERROR');
            this.loadError = error;
            this.isLoading = false;
            return NEVER;
          }),
          take(1),
          tap(job => {
            console.log(job);
            this.waitForBackgroundJobToComplete(job);
          }),
        )
        .subscribe();
    } else {
      this.sunriseService
        .postGiftLspGroup(this.lspGroup, gift)
        .pipe(
          takeUntil(this.onDestroy$),
          catchError(error => {
            this.loadError = error;
            this.isLoading = false;
            return NEVER;
          }),
          take(1),
          tap(giftReponse => {
            this.giftResponse = [giftReponse];
            this.isLoading = false;
          }),
        )
        .subscribe();
    }
  }
}
