import { Injectable } from '@angular/core';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { cloneDeep, sortBy } from 'lodash';
import { Observable, of } from 'rxjs';
import { GiftBasketModel } from '../../components/gift-basket/gift-basket.base.component';
import {
  SetWoodstockGiftBasket,
  SetWoodstockGiftingMatTabIndex,
  SetWoodstockGiftingSelectedPlayerIdentities,
} from './woodstock-gifting.state.actions';

/** Defines the woodstock gifting state model. */
export class WoodstockGiftingStateModel {
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
  public selectedMatIndex: number;
  public giftBasket: GiftBasketModel[];
}

/** Defines the woodstock gifting page state. */
@Injectable({
  providedIn: 'root',
})
@State<WoodstockGiftingStateModel>({
  name: 'woodstockGifting',
  defaults: {
    selectedPlayerIdentities: [],
    selectedMatIndex: 0,
    giftBasket: [],
  },
})
export class WoodstockGiftingState {
  /** Sets the gifting page's selected player identities. */
  @Action(SetWoodstockGiftingSelectedPlayerIdentities, { cancelUncompleted: true })
  public setWoodstockSelectedPlayerIdentities$(
    ctx: StateContext<WoodstockGiftingStateModel>,
    action: SetWoodstockGiftingSelectedPlayerIdentities,
  ): Observable<WoodstockGiftingStateModel> {
    return of(
      ctx.patchState({ selectedPlayerIdentities: cloneDeep(action.selectedPlayerIdentities) }),
    );
  }

  /** Sets the gifting page's selected mat tab index. */
  @Action(SetWoodstockGiftingMatTabIndex, { cancelUncompleted: true })
  public setWoodstockMatTabIndex$(
    ctx: StateContext<WoodstockGiftingStateModel>,
    action: SetWoodstockGiftingMatTabIndex,
  ): Observable<WoodstockGiftingStateModel> {
    return of(ctx.patchState({ selectedMatIndex: cloneDeep(action.selectedMatIndex) }));
  }

  /** Sets the gift basket. */
  @Action(SetWoodstockGiftBasket, { cancelUncompleted: true })
  public setWoodstockGiftBasket$(
    ctx: StateContext<WoodstockGiftingStateModel>,
    action: SetWoodstockGiftBasket,
  ): Observable<WoodstockGiftingStateModel> {
    const giftBasket = sortBy(action.giftBasket, [
      item => {
        return !item.error;
      },
      item => {
        return item.itemType !== 'creditRewards';
      },
      item => {
        return item.itemType;
      },
    ]);

    return of(ctx.patchState({ giftBasket: cloneDeep(giftBasket) }));
  }

  /** Selector for state selected player identities. */
  @Selector()
  public static selectedPlayerIdentities(
    state: WoodstockGiftingStateModel,
  ): IdentityResultAlphaBatch {
    return state.selectedPlayerIdentities;
  }

  /** Selector for state selected mat tab index. */
  @Selector()
  public static selectedMatTabIndex(state: WoodstockGiftingStateModel): number {
    return state.selectedMatIndex;
  }

  /** Selector for state gift basket. */
  @Selector()
  public static giftBasket(state: WoodstockGiftingStateModel): GiftBasketModel[] {
    return state.giftBasket;
  }
}
