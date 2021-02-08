import { Component, forwardRef, OnInit } from '@angular/core';
import { FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ApolloGift, ApolloGroupGift, ApolloMasterInventory } from '@models/apollo';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultBeta } from '@models/identity-query.model';
import { MasterInventoryItem } from '@models/master-inventory-item';
import { Store } from '@ngxs/store';
import { ApolloService } from '@services/apollo';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { GetApolloMasterInventoryList } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.actions';
import { MasterInventoryListMemoryState } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.state';
import { NEVER } from 'rxjs';
import { catchError, take, takeUntil, tap } from 'rxjs/operators';
import { GiftBasketBaseComponent } from '../gift-basket.base.component';

/** Apollo gift basket. */
@Component({
  selector: 'apollo-gift-basket',
  templateUrl: '../gift-basket.component.html',
  styleUrls: ['../gift-basket.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ApolloGiftBasketComponent),
      multi: true,
    },
  ],
})
export class ApolloGiftBasketComponent
  extends GiftBasketBaseComponent<IdentityResultBeta>
  implements OnInit {
  public title = GameTitleCodeName.FM7;

  constructor(
    protected readonly backgroundJobService: BackgroundJobService,
    protected readonly apolloService: ApolloService,
    protected readonly store: Store,
    protected readonly formBuilder: FormBuilder,
  ) {
    super(backgroundJobService, formBuilder);
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.isLoading = true;
    this.store.dispatch(new GetApolloMasterInventoryList()).subscribe(() => {
      this.isLoading = false;
      const apolloMasterInventory = this.store.selectSnapshot<ApolloMasterInventory>(
        MasterInventoryListMemoryState.apolloMasterInventory,
      );
      this.masterInventory = apolloMasterInventory;
    });
  }

  /** Sends the gift basket. */
  public sendGiftBasket(): void {
    this.isLoading = true;
    const giftBasketItems = this.giftBasket.data;
    const gift: ApolloGift = {
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

    // If gifting to players, we are using background jobs
    if (this.usingPlayerIdentities) {
      const groupGift: ApolloGroupGift = gift as ApolloGroupGift;
      groupGift.xuids = this.playerIdentities
        .filter(player => !player.error)
        .map(player => player.xuid);
      this.apolloService
        .postGiftPlayersUsingBackgroundTask(groupGift)
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
    } else {
      this.apolloService
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
