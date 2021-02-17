import { Injectable } from '@angular/core';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { GiftBasketModel } from '@models/master-inventory-item';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { clone } from 'lodash';
import { Observable, of } from 'rxjs';
import {
  SetApolloGiftingSelectedPlayerIdentities,
  SetApolloGiftingMatTabIndex,
  SetApolloGiftBasket,
} from './apollo-gifting.state.actions';

/** Defines the apollo gifting state model. */
export class ApolloGiftingStateModel {
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
  public selectedMatIndex: number;
  public giftBasket: GiftBasketModel[];
}

/** Defines the apollo gifting page state. */
@Injectable({
  providedIn: 'root',
})
@State<Partial<ApolloGiftingStateModel>>({
  name: 'apolloGifting',
  defaults: {
    selectedPlayerIdentities: [],
    selectedMatIndex: 0,
    giftBasket: [],
  },
})
export class ApolloGiftingState {
  /** Sets the gifting page's selected player identities. */
  @Action(SetApolloGiftingSelectedPlayerIdentities, { cancelUncompleted: true })
  public setSelectedPlayerIdentities(
    ctx: StateContext<ApolloGiftingStateModel>,
    action: SetApolloGiftingSelectedPlayerIdentities,
  ): Observable<ApolloGiftingStateModel> {
    return of(ctx.patchState({ selectedPlayerIdentities: action.selectedPlayerIdentities }));
  }

  /** Sets the gifting page's selected mat tab index. */
  @Action(SetApolloGiftingMatTabIndex, { cancelUncompleted: true })
  public setSunriseMatTabIndex(
    ctx: StateContext<ApolloGiftingStateModel>,
    action: SetApolloGiftingMatTabIndex,
  ): Observable<ApolloGiftingStateModel> {
    return of(ctx.patchState({ selectedMatIndex: action.selectedMatIndex }));
  }

  /** Sets the gift basket. */
  @Action(SetApolloGiftBasket, { cancelUncompleted: true })
  public setApolloGiftBasket(
    ctx: StateContext<ApolloGiftingStateModel>,
    action: SetApolloGiftBasket,
  ): Observable<ApolloGiftingStateModel> {

    const giftBasket = action.giftBasket
      .sort((a, b) => {
        return a.itemType.localeCompare(b.itemType) || a.description.localeCompare(b.description);
      })
      .sort((a, b) => a.error === b.error ? 0 : a.error ? -1 : 1);

    return of(ctx.patchState({ giftBasket: clone(giftBasket) }));
  }

  /** Selector for state selected player identities. */
  @Selector()
  public static selectedPlayerIdentities(state: ApolloGiftingStateModel): IdentityResultAlphaBatch {
    return state.selectedPlayerIdentities;
  }

  /** Selector for state selected mat tab index. */
  @Selector()
  public static selectedMatTabIndex(state: ApolloGiftingStateModel): number {
    return state.selectedMatIndex;
  }

  /** Selector for state gift basket. */
  @Selector()
  public static giftBasket(state: ApolloGiftingStateModel): GiftBasketModel[] {
    return state.giftBasket;
  }
}
