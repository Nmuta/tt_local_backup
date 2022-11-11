import BigNumber from 'bignumber.js';
import { Component, forwardRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SteelheadGift, SteelheadGroupGift, SteelheadMasterInventory } from '@models/steelhead';
import { BackgroundJob } from '@models/background-job';
import { GameTitle } from '@models/enums';
import { GiftResponse } from '@models/gift-response';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { MasterInventoryItem } from '@models/master-inventory-item';
import { SteelheadGiftingState } from '@tools-app/pages/gifting/steelhead/state/steelhead-gifting.state';
import { SetSteelheadGiftBasket } from '@tools-app/pages/gifting/steelhead/state/steelhead-gifting.state.actions';
import { Select, Store } from '@ngxs/store';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { GetSteelheadMasterInventoryList } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.actions';
import { MasterInventoryListMemoryState } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.state';
import { Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { GiftBasketBaseComponent, GiftBasketModel } from '../gift-basket.base.component';
import { ZERO } from '@helpers/bignumbers';
import { cloneDeep } from 'lodash';
import { LocalizedStringsMap } from '@models/localization';
import { SteelheadLocalizationService } from '@services/api-v2/steelhead/localization/steelhead-localization.service';
import { SteelheadPlayersGiftService } from '@services/api-v2/steelhead/players/gift/steelhead-players-gift.service';
import { SteelheadGroupGiftService } from '@services/api-v2/steelhead/group/gift/steelhead-group-gift.service';

/** Steelhead gift basket. */
@Component({
  selector: 'steelhead-gift-basket',
  templateUrl: '../gift-basket.component.html',
  styleUrls: ['../gift-basket.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SteelheadGiftBasketComponent),
      multi: true,
    },
  ],
})
export class SteelheadGiftBasketComponent
  extends GiftBasketBaseComponent<IdentityResultAlpha, SteelheadMasterInventory>
  implements OnInit, OnChanges
{
  @Select(SteelheadGiftingState.giftBasket) giftBasket$: Observable<GiftBasketModel[]>;
  public title = GameTitle.FM8;
  public allowSettingExpireDate = true;
  public allowSettingLocalizedMessage = true;

  constructor(
    private readonly steelheadPlayersGiftService: SteelheadPlayersGiftService,
    private readonly steelheadGroupGiftService: SteelheadGroupGiftService,
    steelheadLocalizationService: SteelheadLocalizationService,
    backgroundJobService: BackgroundJobService,
    store: Store,
  ) {
    super(backgroundJobService, store);

    this.selectLocalizedStringService = {
      gameTitle: this.title,
      getLocalizedStrings$(): Observable<LocalizedStringsMap> {
        return steelheadLocalizationService.getLocalizedStrings$();
      },
    };
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    super.ngOnInit();
    this.isLoading = true;
    this.store.dispatch(new GetSteelheadMasterInventoryList()).subscribe(() => {
      this.isLoading = false;
      const steelheadMasterInventory = this.store.selectSnapshot<SteelheadMasterInventory>(
        MasterInventoryListMemoryState.steelheadMasterInventory,
      );

      // must be cloned because a child component modifies this value, and modification of state is disallowed
      this.masterInventory = cloneDeep(steelheadMasterInventory);
      this.itemSelectionList = this.masterInventory;
    });

    this.giftBasket$
      .pipe(
        tap(basket => {
          this.giftBasket.data = cloneDeep(basket);
          this.giftBasketHasErrors = basket.some(item => !!item.restriction);
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe();
  }

  /**
   * TODO: Remove once car group gifting is supported in Steward API
   * https://dev.azure.com/t10motorsport/Motorsport/_workitems/edit/1363280
   * Lifecycle hook.
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.usingPlayerIdentities) {
      // We temporarily have group gifting restrictions with cars
      // Recalculate item errors if switching between player/group gifting
      this.setStateGiftBasket(this.giftBasket.data);
    }
  }

  /** Generates an steelhead gift from the gift basket. */
  public generateGiftInventoryFromGiftBasket(): SteelheadGift {
    const giftBasketItems = this.giftBasket.data;
    return {
      titleMessageId: this.formControls.localizedTitleMessageInfo.value?.id,
      bodyMessageId: this.formControls.localizedBodyMessageInfo.value?.id,
      expireAfterDays: this.getExpireDateInDays(),
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
      },
    };
  }

  /** Populates the gift basket from the set reference inventory. */
  public populateGiftBasketFromReference(): void {
    if (!this.referenceInventory) {
      return;
    }
    const referenceInventory = this.referenceInventory;
    function mapKey(key: keyof SteelheadMasterInventory): GiftBasketModel[] {
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
    ]);
  }

  /** Sends an steelhead gift to players. */
  public sendGiftToPlayers$(gift: SteelheadGift): Observable<BackgroundJob<void>> {
    const groupGift: SteelheadGroupGift = gift as SteelheadGroupGift;
    groupGift.xuids = this.playerIdentities
      .filter(player => !player.error)
      .map(player => player.xuid);

    return this.steelheadPlayersGiftService.postGiftPlayersUsingBackgroundTask$(groupGift);
  }

  /** Sends an steelhead gift to an LSP group. */
  public sendGiftToLspGroup$(gift: SteelheadGift): Observable<GiftResponse<BigNumber>> {
    return this.steelheadGroupGiftService.postGiftLspGroup$(this.lspGroup.id, gift);
  }

  /** Sets the state gift basket. */
  public setStateGiftBasket(giftBasket: GiftBasketModel[]): void {
    giftBasket = this.setGiftBasketItemErrors(giftBasket);
    this.store.dispatch(new SetSteelheadGiftBasket(giftBasket));
  }

  /** Verifies gift basket and sets item.restriction if one is found. */
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
      giftBasket[i].restriction = !itemExists
        ? 'Item does not exist in the master inventory.'
        : undefined;
    }

    // Verify credit reward limits
    if (!this.ignoreMaxCreditLimit) {
      const creditsAboveLimit = giftBasket.findIndex(
        item =>
          item.id < ZERO &&
          item.description.toLowerCase() === 'credits' &&
          item.quantity > 500_000_000,
      );
      if (creditsAboveLimit >= 0) {
        giftBasket[creditsAboveLimit].restriction = 'Credit limit for a gift is 500,000,000.';
      }
    }

    // Verify credit reward is under max
    const creditsAboveMax = giftBasket.findIndex(
      item =>
        item.id < ZERO &&
        item.description.toLowerCase() === 'credits' &&
        item.quantity > 999_999_999,
    );
    if (creditsAboveMax >= 0) {
      giftBasket[creditsAboveMax].restriction = 'Credit max is 999,999,999.';
    }

    // TODO: Remove once car group gifting is supported in Steward API
    // https://dev.azure.com/t10motorsport/Motorsport/_workitems/edit/1363280
    if (!this.usingPlayerIdentities) {
      giftBasket = giftBasket.map(item => {
        if (item.itemType === 'cars') {
          item.restriction = 'Group gifting cars is currently unsupported in FM8.';
        }

        return item;
      });
    }

    return giftBasket;
  }
}
