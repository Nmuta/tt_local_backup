import { Component, forwardRef, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BackgroundJob } from '@models/background-job';
import { GameTitleCodeName } from '@models/enums';
import { GiftResponse } from '@models/gift-response';
import { GravityGift } from '@models/gravity';
import { GravityMasterInventoryLists } from '@models/gravity/gravity-master-inventory-list.model';
import { IdentityResultBeta } from '@models/identity-query.model';
import { MasterInventoryItem } from '@models/master-inventory-item';
import { GravityGiftingState } from '@navbar-app/pages/gifting/gravity/state/gravity-gifting.state';
import { SetGravityGiftBasket } from '@navbar-app/pages/gifting/gravity/state/gravity-gifting.state.actions';
import { Select, Store } from '@ngxs/store';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { GravityService } from '@services/gravity';
import { GetGravityMasterInventoryList } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.actions';
import { MasterInventoryListMemoryState } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.state';
import { NEVER, Observable, Subject, throwError } from 'rxjs';
import { catchError, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { GiftBasketBaseComponent, GiftBasketModel } from '../gift-basket.base.component';

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
  implements OnInit, OnChanges {
  @Select(GravityGiftingState.giftBasket) giftBasket$: Observable<GiftBasketModel[]>;

  public newIdentitySelectedSubject$ = new Subject<string>();
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
  public ngOnInit(): void {
    this.newIdentitySelectedSubject$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(() => {
          this.isLoading = false;
          this.loadError = undefined;
          this.selectedGameSettingsId = undefined;
          this.masterInventory = undefined;
        }),
        filter(t10Id => !!t10Id),
        switchMap(t10Id => {
          this.isLoading = true;
          return this.gravityService.getPlayerDetailsByT10Id(t10Id).pipe(
            catchError(error => {
              this.isLoading = false;
              this.loadError = error;
              return NEVER;
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
                return NEVER;
              }),
            );
        }),
        tap(() => {
          this.isLoading = false;
          const gravityMasterInventory = this.store.selectSnapshot<GravityMasterInventoryLists>(
            MasterInventoryListMemoryState.gravityMasterInventory,
          );
          this.masterInventory = gravityMasterInventory[this.selectedGameSettingsId];

          // With a potentially new game gettings, we need to verify the gift basket contents against the
          // master inventory and set errors.
          this.setStateGiftBasket(this.giftBasket.data ?? []);
        }),
      )
      .subscribe();

    this.giftBasket$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(basket => {
          this.giftBasket.data = basket;
          this.giftBasketHasErrors = basket.some(item => !!item.error);
        }),
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

  /** Sends a gravity gift to players. */
  public sendGiftToPlayers(gift: GravityGift): Observable<BackgroundJob<void>> {
    const t10Id = this.playerIdentities[0].t10Id;
    return this.gravityService.postGiftPlayerUsingBackgroundTask(t10Id, gift);
  }

  /** Sends a gravity gift to an LSP group. */
  public sendGiftToLspGroup(_gift: GravityGift): Observable<GiftResponse<bigint>> {
    return throwError('Gravity does not support LSP gifting.');
  }

  /** Sets the state gift basket. */
  public setStateGiftBasket(giftBasket: GiftBasketModel[]): void {
    giftBasket = this.setGiftBasketItemErrors(giftBasket);
    this.store.dispatch(new SetGravityGiftBasket(giftBasket));
  }

  /** Verifies gift basket and sets item.error if one is found. */
  public setGiftBasketItemErrors(giftBasket: GiftBasketModel[]): GiftBasketModel[] {
    // Check item ids & types to verify item is real
    for (let i = 0; i < giftBasket.length; i++) {
      const item = giftBasket[i];
      const itemExists = this.masterInventory[item.itemType]?.some(
        (masterItem: MasterInventoryItem) => masterItem.id === item.id,
      );
      giftBasket[i].error = !itemExists
        ? 'Item does not exist in the master inventory.'
        : undefined;
    }

    // Verify credit reward limits
    const creditRewardsItemType = 'creditrewards';
    const softCurrencyAboveLimit = giftBasket.findIndex(
      item =>
        item.itemType.toLowerCase() === creditRewardsItemType &&
        item.id === BigInt(0) &&
        item.quantity > 500_000_000,
    );
    if (softCurrencyAboveLimit >= 0) {
      giftBasket[softCurrencyAboveLimit].error = 'Soft Currency limit for a gift is 500,000,000.';
    }

    return giftBasket;
  }
}
