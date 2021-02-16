import { Component, forwardRef, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BackgroundJob } from '@models/background-job';
import { GameTitleCodeName } from '@models/enums';
import { GiftResponse } from '@models/gift-response';
import { GravityGift } from '@models/gravity';
import { GravityMasterInventoryLists } from '@models/gravity/gravity-master-inventory-list.model';
import { IdentityResultBeta } from '@models/identity-query.model';
import { GiftBasketModel, MasterInventoryItem } from '@models/master-inventory-item';
import { GravityGiftingState } from '@navbar-app/pages/gifting/gravity/state/gravity-gifting.state';
import { SetGravityGiftBasket } from '@navbar-app/pages/gifting/gravity/state/gravity-gifting.state.actions';
import { Select, Store } from '@ngxs/store';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { GravityService } from '@services/gravity';
import { GetGravityMasterInventoryList } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.actions';
import { MasterInventoryListMemoryState } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.state';
import { NEVER, Observable, Subject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
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
    this.newIdentitySelectedSubject$.pipe(
      takeUntil(this.onDestroy$),
      tap(() => {
        this.isLoading = false;
        this.loadError = undefined;
        this.selectedGameSettingsId = undefined;
      }),
      filter(t10Id => !!t10Id && t10Id !== ''),
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
        if(!details) {
          return throwError('Invalid T10 Id');
        }
        this.selectedGameSettingsId = details.lastGameSettingsUsed;
        return this.store.dispatch(new GetGravityMasterInventoryList(this.selectedGameSettingsId)).pipe(
          catchError(error => {
            this.isLoading = false;
            this.loadError = error;
            return NEVER;
          }),
        )
      }),
      tap(() => {
        this.isLoading = false;
        const gravityMasterInventory = this.store.selectSnapshot<GravityMasterInventoryLists>(
          MasterInventoryListMemoryState.gravityMasterInventory,
        );
        this.masterInventory = gravityMasterInventory[this.selectedGameSettingsId];

        // TODO: When a valid game settings updates the masterInventory, we need to verify the existing contents of a gift basket
        // in relation to the new master inventory (show item errors & disallow gift send while there are errors)

        // TODO:When no/ bad game settings, we need to show show errors for all items in the gift basket and disallow gift send
      })
    ).subscribe();

    this.giftBasket$.pipe(
      takeUntil(this.onDestroy$),
      take(1),
      tap(basket => {
        this.giftBasket.data = basket;
      })
    ).subscribe();

    if(this.playerIdentities.length > 0) {
      this.newIdentitySelectedSubject$.next(this.playerIdentities[0].t10Id);
    }
  }

  /** Angular lifecycle */
  public ngOnChanges(_changes: SimpleChanges): void {
    // Add back in changes look
    const playerT10Id = this.playerIdentities.length > 0 ? this.playerIdentities[0].t10Id : null;
    this.newIdentitySelectedSubject$.next(playerT10Id);
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
    this.store.dispatch(new SetGravityGiftBasket(giftBasket)).pipe(
      takeUntil(this.onDestroy$),
      take(1),
      tap(() => {
        const giftBasket = this.store.selectSnapshot(GravityGiftingState.giftBasket);
        this.giftBasket.data = giftBasket;
      })
    ).subscribe();
  }
}
