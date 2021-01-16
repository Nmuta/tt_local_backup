import { Injectable } from '@angular/core';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import {
  SetApolloGiftingSelectedPlayerIdentities,
  SetApolloGiftingMatTabIndex,
} from './apollo-gifting.state.actions';

/** Defines the apollo gifting state model. */
export class ApolloGiftingStateModel {
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
  public selectedMatIndex: number;
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
}
