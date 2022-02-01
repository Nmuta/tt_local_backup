import BigNumber from 'bignumber.js';
import { Component, forwardRef, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BackgroundJob } from '@models/background-job';
import { GameTitleCodeName } from '@models/enums';
import { GiftResponse } from '@models/gift-response';
import { GravityGift, GravityMasterInventoryLists, GravityMasterInventory } from '@models/gravity';
import { IdentityResultBeta } from '@models/identity-query.model';
import { MasterInventoryItem } from '@models/master-inventory-item';
import { GravityGiftingState } from '@tools-app/pages/gifting/gravity/state/gravity-gifting.state';
import { SetGravityGiftBasket } from '@tools-app/pages/gifting/gravity/state/gravity-gifting.state.actions';
import { Select, Store } from '@ngxs/store';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { GravityService } from '@services/gravity';
import { GetGravityMasterInventoryList } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.actions';
import { MasterInventoryListMemoryState } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.state';
import { EMPTY, Observable, Subject, throwError } from 'rxjs';
import { catchError, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { GiftBasketBaseComponent, GiftBasketModel } from '../gift-basket.base.component';
import { ONE, ZERO } from '@helpers/bignumbers';
import { cloneDeep } from 'lodash';

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
  extends GiftBasketBaseComponent<IdentityResultBeta, GravityMasterInventory>
  implements OnInit, OnChanges
{
  @Select(GravityGiftingState.giftBasket) giftBasket$: Observable<GiftBasketModel[]>;

  public newIdentitySelectedSubject$ = new Subject<string>();
  public title = GameTitleCodeName.Street;
  public hasGameSettings: boolean = true;

  constructor(
    private readonly gravityService: GravityService,
    backgroundJobService: BackgroundJobService,
    store: Store,
    formBuilder: FormBuilder,
  ) {
    super(backgroundJobService, formBuilder, store);
  }

  /** Angular lifecycle */
  public ngOnInit(): void {
    this.newIdentitySelectedSubject$
      .pipe(
        tap(() => {
          this.isLoading = false;
          this.loadError = undefined;
          this.selectedGameSettingsId = undefined;
          this.masterInventory = undefined;
        }),
        filter(t10Id => !!t10Id),
        switchMap(t10Id => {
          this.isLoading = true;
          return this.gravityService.getPlayerDetailsByT10Id$(t10Id).pipe(
            catchError(error => {
              this.isLoading = false;
              this.loadError = error;
              return EMPTY;
            }),
          );
        }),
        switchMap(details => {
          this.selectedGameSettingsId = details.lastGameSettingsUsed;
          return this.store
            .dispatch(new GetGravityMasterInventoryList(this.selectedGameSettingsId))
            .pipe(
              catchError(error => {
                this.isLoading = false;
                this.loadError = error;
                return EMPTY;
              }),
            );
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        this.isLoading = false;
        const gravityMasterInventory = this.store.selectSnapshot<GravityMasterInventoryLists>(
          MasterInventoryListMemoryState.gravityMasterInventory,
        );

        // must be cloned because a child component modifies this value, and modification of state is disallowed
        this.masterInventory = cloneDeep(gravityMasterInventory[this.selectedGameSettingsId]);
        this.itemSelectionList = this.masterInventory;

        // With a potentially new game gettings, we need to verify the gift basket contents against the
        // master inventory and set errors.
        this.setStateGiftBasket(this.giftBasket.data ?? []);
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

    if (this.playerIdentities.length > 0) {
      this.newIdentitySelectedSubject$.next(this.playerIdentities[0].t10Id);
    }
  }

  /** Angular lifecycle */
  public ngOnChanges(changes: SimpleChanges): void {
    if (!!changes?.playerIdentities) {
      const playerT10Id = this.playerIdentities.length > 0 ? this.playerIdentities[0].t10Id : null;
      this.newIdentitySelectedSubject$.next(playerT10Id);
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

  /** Populates the gift basket from the set reference inventory. */
  public populateGiftBasketFromReference(): void {
    if (!this.referenceInventory) {
      return;
    }
    const referenceInventory = this.referenceInventory;
    function mapKey(key: keyof GravityMasterInventory): GiftBasketModel[] {
      return referenceInventory[key]
        .map(i => {
          return <GiftBasketModel>{
            description: i.description,
            id: i.id,
            itemType: key,
            quantity: Number(i.quantity),
            edit: undefined,
            error: undefined,
          };
        })
        .filter(item => item.quantity > 0);
    }

    this.setStateGiftBasket([
      ...mapKey('cars'),
      ...mapKey('creditRewards'),
      ...mapKey('repairKits'),
      ...mapKey('masteryKits'),
      ...mapKey('energyRefills'),
      ...mapKey('upgradeKits'),
    ]);
  }

  /** Sends a gravity gift to players. */
  public sendGiftToPlayers$(gift: GravityGift): Observable<BackgroundJob<void>> {
    const t10Id = this.playerIdentities[0].t10Id;
    return this.gravityService.postGiftPlayerUsingBackgroundTask$(t10Id, gift);
  }

  /** Sends a gravity gift to an LSP group. */
  public sendGiftToLspGroup$(_gift: GravityGift): Observable<GiftResponse<BigNumber>> {
    return throwError('Gravity does not support LSP gifting.');
  }

  /** Sets the state gift basket. */
  public setStateGiftBasket(giftBasket: GiftBasketModel[]): void {
    giftBasket = this.setGiftBasketItemErrors(giftBasket);
    this.store.dispatch(new SetGravityGiftBasket(giftBasket));
  }

  /** Verifies gift basket and sets item.restriction if one is found. */
  public setGiftBasketItemErrors(giftBasket: GiftBasketModel[]): GiftBasketModel[] {
    // Check item ids & types to verify item is real
    for (let i = 0; i < giftBasket.length; i++) {
      const item = giftBasket[i];
      const itemExists = this.masterInventory[item.itemType]?.some(
        (masterItem: MasterInventoryItem) => masterItem.id.isEqualTo(item.id),
      );
      giftBasket[i].restriction = !itemExists
        ? 'Item does not exist in the master inventory.'
        : undefined;
    }

    const creditRewardsItemType = 'creditrewards';

    // Verify credit reward limits
    if (!this.ignoreMaxCreditLimit) {
      const softCurrencyAboveLimit = giftBasket.findIndex(
        item =>
          item.itemType.toLowerCase() === creditRewardsItemType &&
          item.id.isEqualTo(ZERO) &&
          item.quantity > 500_000_000,
      );
      if (softCurrencyAboveLimit >= 0) {
        giftBasket[softCurrencyAboveLimit].restriction =
          'Soft Currency limit for a gift is 500,000,000.';
      }
    }

    // Verify credit reward is under max
    const softCurrencyAboveMax = giftBasket.findIndex(
      item =>
        item.itemType.toLowerCase() === creditRewardsItemType &&
        item.id.isEqualTo(ZERO) &&
        item.quantity > 999_999_999,
    );

    if (softCurrencyAboveMax >= 0) {
      giftBasket[softCurrencyAboveMax].restriction = 'Soft Currency max is 999,999,999.';
    }

    const hardCurrencyAboveLimit = giftBasket.findIndex(
      item =>
        item.itemType.toLowerCase() === creditRewardsItemType &&
        item.id.isEqualTo(ONE) &&
        item.quantity > 15_000,
    );
    if (hardCurrencyAboveLimit >= 0) {
      giftBasket[hardCurrencyAboveLimit].restriction = 'Hard Currency limit for a gift is 15,000.';
    }

    return giftBasket;
  }
}
