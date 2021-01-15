import { Injectable } from '@angular/core';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import {
  SetApolloGiftHistorySelectedPlayerIdentities,
  SetApolloGiftHistoryMatTabIndex,
} from './apollo-gift-history.state.actions';

/** Defines the apollo gift history state model. */
export class ApolloGiftHistoryStateModel {
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
  public selectedMatIndex: number;
}

/** Defines the apollo gift history page state. */
@Injectable({
  providedIn: 'root',
})
@State<Partial<ApolloGiftHistoryStateModel>>({
  name: 'apolloGiftHistory',
  defaults: {
    selectedPlayerIdentities: [],
    selectedMatIndex: 0,
  },
})
export class ApolloGiftHistoryState {
  /** Sets the gift history page's selected player identities. */
  @Action(SetApolloGiftHistorySelectedPlayerIdentities, { cancelUncompleted: true })
  public setFakeApi(
    ctx: StateContext<ApolloGiftHistoryStateModel>,
    action: SetApolloGiftHistorySelectedPlayerIdentities,
  ): Observable<ApolloGiftHistoryStateModel> {
    return of(ctx.patchState({ selectedPlayerIdentities: action.selectedPlayerIdentities }));
  }

  /** Sets the gift history page's selected mat tab index. */
  @Action(SetApolloGiftHistoryMatTabIndex, { cancelUncompleted: true })
  public setSunriseMatTabIndex(
    ctx: StateContext<ApolloGiftHistoryStateModel>,
    action: SetApolloGiftHistoryMatTabIndex,
  ): Observable<ApolloGiftHistoryStateModel> {
    return of(ctx.patchState({ selectedMatIndex: action.selectedMatIndex }));
  }

  /** Selector for state selected player identities. */
  @Selector()
  public static selectedPlayerIdentities(state: ApolloGiftHistoryStateModel): IdentityResultAlphaBatch {
    return state.selectedPlayerIdentities;
  }

  /** Selector for state selected mat tab index. */
  @Selector()
  public static selectedMatTabIndex(state: ApolloGiftHistoryStateModel): number {
    return state.selectedMatIndex;
  }
}
