import { Component, forwardRef, OnInit } from '@angular/core';
import { FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ApolloGift, ApolloGroupGift, ApolloMasterInventory } from '@models/apollo';
import { BackgroundJob } from '@models/background-job';
import { GameTitleCodeName } from '@models/enums';
import { GiftResponse } from '@models/gift-response';
import { IdentityResultBeta } from '@models/identity-query.model';
import { GiftBasketModel, MasterInventoryItem } from '@models/master-inventory-item';
import { ApolloGiftingState } from '@navbar-app/pages/gifting/apollo/state/apollo-gifting.state';
import { SetApolloGiftBasket } from '@navbar-app/pages/gifting/apollo/state/apollo-gifting.state.actions';
import { Select, Store } from '@ngxs/store';
import { ApolloService } from '@services/apollo';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { GetApolloMasterInventoryList } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.actions';
import { MasterInventoryListMemoryState } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.state';
import { Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
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
  @Select(ApolloGiftingState.giftBasket) giftBasket$: Observable<GiftBasketModel[]>;
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

    this.giftBasket$.pipe(
      takeUntil(this.onDestroy$),
      tap(basket => {
        this.giftBasket.data = basket;
        this.giftBasketErrors = basket.some(item => !!item.error && item.error != '');
      })
    ).subscribe();
  }

  /** Generates an apollo gift from the gift basket. */
  public generateGiftInventoryFromGiftBasket(): ApolloGift {
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
      },
    };
  }

  /** Sends an apollo gift to players. */
  public sendGiftToPlayers(gift: ApolloGift): Observable<BackgroundJob<void>> {
    const groupGift: ApolloGroupGift = gift as ApolloGroupGift;
    groupGift.xuids = this.playerIdentities
      .filter(player => !player.error)
      .map(player => player.xuid);

    return this.apolloService.postGiftPlayersUsingBackgroundTask(groupGift);
  }

  /** Sends an apollo gift to an LSP group. */
  public sendGiftToLspGroup(gift: ApolloGift): Observable<GiftResponse<bigint>> {
    return this.apolloService.postGiftLspGroup(this.lspGroup, gift);
  }

  /** Sets the state gift basket. */
  public setStateGiftBasket(giftBasket: GiftBasketModel[]): void {
    giftBasket = this.setGiftBasketItemErrors(giftBasket);
    this.store.dispatch(new SetApolloGiftBasket(giftBasket));
  }

  /** Verifies gift basket and sets item.error if one is found. */
  private setGiftBasketItemErrors(giftBasket: GiftBasketModel[]): GiftBasketModel[] {
    // Check item ids & types to verify item is real
    for(let i = 0; i < giftBasket.length; i++) {
      const item = giftBasket[i];
      const itemExists = this.masterInventory[item.itemType]?.some((masterItem: MasterInventoryItem) => masterItem.id === item.id && (masterItem.id >= BigInt(0) || (masterItem.id < BigInt(0) && masterItem.description === item.description)));
      giftBasket[i].error = !itemExists ? 'Item is not a valid gift.' : undefined
    }

    // Verify credit reward limits
    const creditsAboveLimit = giftBasket.findIndex(item => item.id < 0 && item.description.toLowerCase() === 'credits' && item.quantity > 500_000_000);
    if(creditsAboveLimit >= 0) {
      giftBasket[creditsAboveLimit].error = 'Credit limit for a gift is 500,000,000.';
    }

    return giftBasket;
  }
}
