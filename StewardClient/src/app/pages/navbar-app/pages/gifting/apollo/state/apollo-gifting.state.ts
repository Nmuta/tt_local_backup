import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { SetApolloSelectedPlayerIdentities } from './apollo-gifting.state.actions';

/** Defines the apollo gifting state model. */
export class ApolloGiftingStateModel {
  public selectedPlayerIdentities: unknown[];
}

@Injectable({
  providedIn: 'root',
})
@State<Partial<ApolloGiftingStateModel>>({
  name: 'apolloGifting',
  defaults: {
    selectedPlayerIdentities: [],
  },
})
/** Defines the apollo gifting page stte. */
export class ApolloGiftingState {
  /** Sets the gifting page's selected player identities. */
  @Action(SetApolloSelectedPlayerIdentities, { cancelUncompleted: true })
  public setFakeApi(
    ctx: StateContext<ApolloGiftingStateModel>,
    action: SetApolloSelectedPlayerIdentities,
  ): Observable<ApolloGiftingStateModel> {
    return of(ctx.patchState({ selectedPlayerIdentities: action.selectedPlayerIdentities }));
  }

  /** Selector for state selected player identities. */
  @Selector()
  public static selectedPlayerIdentities(state: ApolloGiftingStateModel): unknown[] {
    return state.selectedPlayerIdentities;
  }
}
