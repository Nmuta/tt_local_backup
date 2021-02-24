import { Component, forwardRef, OnInit } from '@angular/core';
import { FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BackgroundJob } from '@models/background-job';
import { GameTitleCodeName } from '@models/enums';
import { GiftResponse } from '@models/gift-response';
import { IdentityResultBeta } from '@models/identity-query.model';
import { MasterInventoryItem } from '@models/master-inventory-item';
import { SunriseGift, SunriseGroupGift } from '@models/sunrise';
import { SunriseMasterInventory } from '@models/sunrise/sunrise-master-inventory.model';
import { SunriseGiftingState } from '@navbar-app/pages/gifting/sunrise/state/sunrise-gifting.state';
import { SetSunriseGiftBasket } from '@navbar-app/pages/gifting/sunrise/state/sunrise-gifting.state.actions';
import { Select, Store } from '@ngxs/store';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { SunriseService } from '@services/sunrise';
import { GetSunriseMasterInventoryList } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.actions';
import { MasterInventoryListMemoryState } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.state';
import { Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { GiftBasketBaseComponent, GiftBasketModel } from '../gift-basket.base.component';

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
  @Select(SunriseGiftingState.giftBasket) giftBasket$: Observable<GiftBasketModel[]>;
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

    this.giftBasket$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(basket => {
          this.giftBasket.data = basket;
          this.giftBasketHasErrors = basket.some(item => !!item.error);
        }),
      )
      .subscribe();
  }

  /** Generates a sunrise gift from the gift basket. */
  public generateGiftInventoryFromGiftBasket(): SunriseGift {
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
  }

  /** Sends a sunrise gift to players. */
  public sendGiftToPlayers(gift: SunriseGift): Observable<BackgroundJob<void>> {
    const groupGift = gift as SunriseGroupGift;
    groupGift.xuids = this.playerIdentities
      .filter(player => !player.error)
      .map(player => player.xuid);

    return this.sunriseService.postGiftPlayersUsingBackgroundTask(groupGift);
  }

  /** Sends a sunrise gift to an LSP group. */
  public sendGiftToLspGroup(gift: SunriseGift): Observable<GiftResponse<bigint>> {
    return this.sunriseService.postGiftLspGroup(this.lspGroup, gift);
  }

  /** Sets the state gift basket. */
  public setStateGiftBasket(giftBasket: GiftBasketModel[]): void {
    giftBasket = this.setGiftBasketItemErrors(giftBasket);
    this.store.dispatch(new SetSunriseGiftBasket(giftBasket));
  }

  /** Verifies gift basket and sets item.error if one is found. */
  public setGiftBasketItemErrors(giftBasket: GiftBasketModel[]): GiftBasketModel[] {
    // Check item ids & types to verify item is real
    for (let i = 0; i < giftBasket.length; i++) {
      const item = giftBasket[i];
      const itemExists = this.masterInventory[item.itemType]?.some(
        (masterItem: MasterInventoryItem) =>
          masterItem.id === item.id &&
          (masterItem.id >= BigInt(0) ||
            (masterItem.id < BigInt(0) && masterItem.description === item.description)),
      );
      giftBasket[i].error = !itemExists
        ? 'Item does not exist in the master inventory.'
        : undefined;
    }

    // Verify credit reward limits
    const creditsAboveLimit = giftBasket.findIndex(
      item =>
        item.id < 0 && item.description.toLowerCase() === 'credits' && item.quantity > 500_000_000,
    );
    if (creditsAboveLimit >= 0) {
      giftBasket[creditsAboveLimit].error = 'Credit limit for a gift is 500,000,000.';
    }

    const wheelSpinsAboveLimit = giftBasket.findIndex(
      item => item.id < 0 && item.description.toLowerCase() === 'wheelspins' && item.quantity > 200,
    );
    if (wheelSpinsAboveLimit >= 0) {
      giftBasket[wheelSpinsAboveLimit].error = 'Wheel Spin limit for a gift is 200.';
    }

    const superWheelSpinsAboveLimit = giftBasket.findIndex(
      item =>
        item.id < 0 && item.description.toLowerCase() === 'superwheelspins' && item.quantity > 200,
    );
    if (superWheelSpinsAboveLimit >= 0) {
      giftBasket[superWheelSpinsAboveLimit].error = 'Super Wheel Spin limit for a gift is 200.';
    }

    return giftBasket;
  }
}
