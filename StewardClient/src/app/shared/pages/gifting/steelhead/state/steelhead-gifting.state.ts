import { Injectable } from '@angular/core';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { cloneDeep, sortBy } from 'lodash';
import { Observable, of } from 'rxjs';
import { GiftBasketModel } from '../../components/gift-basket/gift-basket.base.component';
import {
  SetSteelheadGiftingSelectedPlayerIdentities,
  SetSteelheadGiftingMatTabIndex,
  SetSteelheadGiftBasket,
} from './steelhead-gifting.state.actions';

/** Defines the steelhead gifting state model. */
export class SteelheadGiftingStateModel {
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
  public selectedMatIndex: number;
  public giftBasket: GiftBasketModel[];
}

/** Defines the steelhead gifting page state. */
@State<Partial<SteelheadGiftingStateModel>>({
  name: 'steelheadGifting',
  defaults: {
    selectedPlayerIdentities: [],
    selectedMatIndex: 0,
    giftBasket: [],
  },
})
@Injectable({
  providedIn: 'root',
})
export class SteelheadGiftingState {
  /** Sets the gifting page's selected player identities. */
  @Action(SetSteelheadGiftingSelectedPlayerIdentities, { cancelUncompleted: true })
  public setSelectedPlayerIdentities$(
    ctx: StateContext<SteelheadGiftingStateModel>,
    action: SetSteelheadGiftingSelectedPlayerIdentities,
  ): Observable<SteelheadGiftingStateModel> {
    return of(
      ctx.patchState({ selectedPlayerIdentities: cloneDeep(action.selectedPlayerIdentities) }),
    );
  }

  /** Sets the gifting page's selected mat tab index. */
  @Action(SetSteelheadGiftingMatTabIndex, { cancelUncompleted: true })
  public setSunriseMatTabIndex$(
    ctx: StateContext<SteelheadGiftingStateModel>,
    action: SetSteelheadGiftingMatTabIndex,
  ): Observable<SteelheadGiftingStateModel> {
    return of(ctx.patchState({ selectedMatIndex: cloneDeep(action.selectedMatIndex) }));
  }

  /** Sets the gift basket. */
  @Action(SetSteelheadGiftBasket, { cancelUncompleted: true })
  public setSteelheadGiftBasket$(
    ctx: StateContext<SteelheadGiftingStateModel>,
    action: SetSteelheadGiftBasket,
  ): Observable<SteelheadGiftingStateModel> {
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
    state: SteelheadGiftingStateModel,
  ): IdentityResultAlphaBatch {
    return state.selectedPlayerIdentities;
  }

  /** Selector for state selected mat tab index. */
  @Selector()
  public static selectedMatTabIndex(state: SteelheadGiftingStateModel): number {
    return state.selectedMatIndex;
  }

  /** Selector for state gift basket. */
  @Selector()
  public static giftBasket(state: SteelheadGiftingStateModel): GiftBasketModel[] {
    return state.giftBasket;
  }
}
