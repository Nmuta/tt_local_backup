import { Injectable } from '@angular/core';
import { IdentityResultBetaBatch } from '@models/identity-query.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { clone } from 'lodash';
import { Observable, of } from 'rxjs';
import { SetGravitySelectedPlayerIdentities } from './gravity-gift-history.state.actions';

/** Defines the user state model. */
export class GravityGiftHistoryStateModel {
  public selectedPlayerIdentities: IdentityResultBetaBatch;
}

/** Defines the gravity gift history page state. */
@State<GravityGiftHistoryStateModel>({
  name: 'gravityGiftHistory',
  defaults: {
    selectedPlayerIdentities: [],
  },
})
@Injectable({
  providedIn: 'root',
})
export class GravityGiftHistoryState {
  /** Sets the gift history page's selected player identities. */
  @Action(SetGravitySelectedPlayerIdentities, { cancelUncompleted: true })
  public setFakeApi$(
    ctx: StateContext<GravityGiftHistoryStateModel>,
    action: SetGravitySelectedPlayerIdentities,
  ): Observable<GravityGiftHistoryStateModel> {
    return of(ctx.patchState({ selectedPlayerIdentities: clone(action.selectedPlayerIdentities) }));
  }

  /** Selector for state selected player identities. */
  @Selector()
  public static selectedPlayerIdentities(
    state: GravityGiftHistoryStateModel,
  ): IdentityResultBetaBatch {
    return state.selectedPlayerIdentities;
  }
}
