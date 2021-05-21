import BigNumber from 'bignumber.js';
import { Component, forwardRef, OnInit } from '@angular/core';
import { FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BackgroundJob } from '@models/background-job';
import { GameTitleCodeName } from '@models/enums';
import { GiftResponse } from '@models/gift-response';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { MasterInventoryItem } from '@models/master-inventory-item';
import { WoodstockGift, WoodstockGroupGift, WoodstockMasterInventory } from '@models/woodstock';
import { WoodstockGiftingState } from '@shared/pages/gifting/woodstock/state/woodstock-gifting.state';
import { SetWoodstockGiftBasket } from '@shared/pages/gifting/woodstock/state/woodstock-gifting.state.actions';
import { Select, Store } from '@ngxs/store';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { WoodstockService } from '@services/woodstock';
import { GetWoodstockMasterInventoryList } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.actions';
import { MasterInventoryListMemoryState } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.state';
import { Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { GiftBasketBaseComponent, GiftBasketModel } from '../gift-basket.base.component';
import { ZERO } from '@helpers/bignumbers';
import { cloneDeep } from 'lodash';

/** Woodstock gift basket. */
@Component({
  selector: 'woodstock-gift-basket',
  templateUrl: '../gift-basket.component.html',
  styleUrls: ['../gift-basket.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WoodstockGiftBasketComponent),
      multi: true,
    },
  ],
})
export class WoodstockGiftBasketComponent
  extends GiftBasketBaseComponent<IdentityResultAlpha, WoodstockMasterInventory>
  implements OnInit {
  @Select(WoodstockGiftingState.giftBasket) giftBasket$: Observable<GiftBasketModel[]>;
  public title = GameTitleCodeName.FH5;

  constructor(
    private readonly woodstockService: WoodstockService,
    backgroundJobService: BackgroundJobService,
    store: Store,
    formBuilder: FormBuilder,
  ) {
    super(backgroundJobService, formBuilder, store);
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.isLoading = true;
    this.store.dispatch(new GetWoodstockMasterInventoryList()).subscribe(() => {
      this.isLoading = false;
      const woodstockMasterInventory = this.store.selectSnapshot<WoodstockMasterInventory>(
        MasterInventoryListMemoryState.woodstockMasterInventory,
      );

      // must be cloned because a child component modifies this value, and modification of state is disallowed
      this.masterInventory = cloneDeep(woodstockMasterInventory);
    });

    this.giftBasket$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(basket => {
          this.giftBasket.data = cloneDeep(basket);
          this.giftBasketHasErrors = basket.some(item => !!item.error);
        }),
      )
      .subscribe();
  }

  /** Generates a woodstock gift from the gift basket. */
  public generateGiftInventoryFromGiftBasket(): WoodstockGift {
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

  /** Populates the gift basket from the set reference inventory. */
  public populateGiftBasketFromReference(): void {
    if (!this.referenceInventory) {
      return;
    }
    const referenceInventory = this.referenceInventory;
    function mapKey(key: keyof WoodstockMasterInventory): GiftBasketModel[] {
      return referenceInventory[key].map(i => {
        return <GiftBasketModel>{
          description: i.description,
          id: i.id,
          itemType: key,
          quantity: Number(i.quantity),
          edit: undefined,
          error: undefined,
        };
      });
    }

    this.setStateGiftBasket([
      ...mapKey('cars'),
      ...mapKey('creditRewards'),
      ...mapKey('vanityItems'),
      ...mapKey('carHorns'),
      ...mapKey('quickChatLines'),
      ...mapKey('emotes'),
    ]);
  }

  /** Sends a woodstock gift to players. */
  public sendGiftToPlayers$(gift: WoodstockGift): Observable<BackgroundJob<void>> {
    const groupGift = gift as WoodstockGroupGift;
    groupGift.xuids = this.playerIdentities
      .filter(player => !player.error)
      .map(player => player.xuid);

    return this.woodstockService.postGiftPlayersUsingBackgroundTask$(groupGift);
  }

  /** Sends a woodstock gift to an LSP group. */
  public sendGiftToLspGroup$(gift: WoodstockGift): Observable<GiftResponse<BigNumber>> {
    return this.woodstockService.postGiftLspGroup$(this.lspGroup, gift);
  }

  /** Sets the state gift basket. */
  public setStateGiftBasket(giftBasket: GiftBasketModel[]): void {
    giftBasket = this.setGiftBasketItemErrors(giftBasket);
    this.store.dispatch(new SetWoodstockGiftBasket(giftBasket));
  }

  /** Verifies gift basket and sets item.error if one is found. */
  public setGiftBasketItemErrors(giftBasket: GiftBasketModel[]): GiftBasketModel[] {
    // Check item ids & types to verify item is real
    for (let i = 0; i < giftBasket.length; i++) {
      const item = giftBasket[i];
      const itemExists = this.masterInventory[item.itemType]?.some(
        (masterItem: MasterInventoryItem) =>
          masterItem.id.isEqualTo(item.id) &&
          (masterItem.id >= ZERO ||
            (masterItem.id < ZERO && masterItem.description === item.description)),
      );
      giftBasket[i].error = !itemExists
        ? 'Item does not exist in the master inventory.'
        : undefined;
    }

    // Verify credit reward limits
    if (!this.ignoreMaxCreditLimit) {
      const creditsAboveLimit = giftBasket.findIndex(
        item =>
          item.id.isLessThan(ZERO) &&
          item.description.toLowerCase() === 'credits' &&
          item.quantity > 500_000_000,
      );
      if (creditsAboveLimit >= 0) {
        giftBasket[creditsAboveLimit].error = 'Credit limit for a gift is 500,000,000.';
      }
    }

    const creditsAboveMax = giftBasket.findIndex(
      item =>
        item.id.isLessThan(ZERO) &&
        item.description.toLowerCase() === 'credits' &&
        item.quantity > 999_999_999,
    );
    if (creditsAboveMax >= 0) {
      giftBasket[creditsAboveMax].error = 'Credit max is 999,999,999.';
    }

    const wheelSpinsAboveLimit = giftBasket.findIndex(
      item =>
        item.id.isLessThan(ZERO) &&
        item.description.toLowerCase() === 'wheelspins' &&
        item.quantity > 200,
    );
    if (wheelSpinsAboveLimit >= 0) {
      giftBasket[wheelSpinsAboveLimit].error = 'Wheel Spin limit for a gift is 200.';
    }

    const superWheelSpinsAboveLimit = giftBasket.findIndex(
      item =>
        item.id.isLessThan(ZERO) &&
        item.description.toLowerCase() === 'superwheelspins' &&
        item.quantity > 200,
    );
    if (superWheelSpinsAboveLimit >= 0) {
      giftBasket[superWheelSpinsAboveLimit].error = 'Super Wheel Spin limit for a gift is 200.';
    }

    return giftBasket;
  }
}
