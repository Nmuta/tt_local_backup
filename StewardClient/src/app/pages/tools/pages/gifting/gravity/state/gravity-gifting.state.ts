import { Injectable } from '@angular/core';
import { IdentityResultBetaBatch } from '@models/identity-query.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { cloneDeep, sortBy } from 'lodash';
import { Observable, of } from 'rxjs';
import { GiftBasketModel } from '../../components/gift-basket/gift-basket.base.component';
import {
  SetGravityGiftBasket,
  SetGravitySelectedPlayerIdentities,
} from './gravity-gifting.state.actions';

/** Defines the user state model. */
export class GravityGiftingStateModel {
  public selectedPlayerIdentities: IdentityResultBetaBatch;
  public giftBasket: GiftBasketModel[];
}

/** Defines the gravity gifting page state. */
@State<GravityGiftingStateModel>({
  name: 'gravityGifting',
  defaults: {
    selectedPlayerIdentities: [],
    giftBasket: [],
  },
})
@Injectable({
  providedIn: 'root',
})
export class GravityGiftingState {
  /** Sets the gifting page's selected player identities. */
  @Action(SetGravitySelectedPlayerIdentities, { cancelUncompleted: true })
  public setFakeApi$(
    ctx: StateContext<GravityGiftingStateModel>,
    action: SetGravitySelectedPlayerIdentities,
  ): Observable<GravityGiftingStateModel> {
    return of(
      ctx.patchState({ selectedPlayerIdentities: cloneDeep(action.selectedPlayerIdentities) }),
    );
  }

  /** Sets the gift basket. */
  @Action(SetGravityGiftBasket, { cancelUncompleted: true })
  public setApolloGiftBasket$(
    ctx: StateContext<GravityGiftingStateModel>,
    action: SetGravityGiftBasket,
  ): Observable<GravityGiftingStateModel> {
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
  public static selectedPlayerIdentities(state: GravityGiftingStateModel): IdentityResultBetaBatch {
    return state.selectedPlayerIdentities;
  }

  /** Selector for state gift basket. */
  @Selector()
  public static giftBasket(state: GravityGiftingStateModel): GiftBasketModel[] {
    return state.giftBasket;
  }
}