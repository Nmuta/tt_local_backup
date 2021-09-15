import { Injectable } from '@angular/core';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { cloneDeep, sortBy } from 'lodash';
import { Observable, of } from 'rxjs';
import { GiftBasketModel } from '../../components/gift-basket/gift-basket.base.component';
import {
  SetSunriseGiftBasket,
  SetSunriseGiftingMatTabIndex,
  SetSunriseGiftingSelectedPlayerIdentities,
} from './sunrise-gifting.state.actions';

/** Defines the sunrise gifting state model. */
export class SunriseGiftingStateModel {
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
  public selectedMatIndex: number;
  public giftBasket: GiftBasketModel[];
}

/** Defines the sunrise gifting page state. */
@State<SunriseGiftingStateModel>({
  name: 'sunriseGifting',
  defaults: {
    selectedPlayerIdentities: [],
    selectedMatIndex: 0,
    giftBasket: [],
  },
})
@Injectable({
  providedIn: 'root',
})
export class SunriseGiftingState {
  /** Sets the gifting page's selected player identities. */
  @Action(SetSunriseGiftingSelectedPlayerIdentities, { cancelUncompleted: true })
  public setSunriseSelectedPlayerIdentities$(
    ctx: StateContext<SunriseGiftingStateModel>,
    action: SetSunriseGiftingSelectedPlayerIdentities,
  ): Observable<SunriseGiftingStateModel> {
    return of(
      ctx.patchState({ selectedPlayerIdentities: cloneDeep(action.selectedPlayerIdentities) }),
    );
  }

  /** Sets the gifting page's selected mat tab index. */
  @Action(SetSunriseGiftingMatTabIndex, { cancelUncompleted: true })
  public setSunriseMatTabIndex$(
    ctx: StateContext<SunriseGiftingStateModel>,
    action: SetSunriseGiftingMatTabIndex,
  ): Observable<SunriseGiftingStateModel> {
    return of(ctx.patchState({ selectedMatIndex: cloneDeep(action.selectedMatIndex) }));
  }

  /** Sets the gift basket. */
  @Action(SetSunriseGiftBasket, { cancelUncompleted: true })
  public setSunriseGiftBasket$(
    ctx: StateContext<SunriseGiftingStateModel>,
    action: SetSunriseGiftBasket,
  ): Observable<SunriseGiftingStateModel> {
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
    state: SunriseGiftingStateModel,
  ): IdentityResultAlphaBatch {
    return state.selectedPlayerIdentities;
  }

  /** Selector for state selected mat tab index. */
  @Selector()
  public static selectedMatTabIndex(state: SunriseGiftingStateModel): number {
    return state.selectedMatIndex;
  }

  /** Selector for state gift basket. */
  @Selector()
  public static giftBasket(state: SunriseGiftingStateModel): GiftBasketModel[] {
    return state.giftBasket;
  }
}
