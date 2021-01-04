import { Injectable } from '@angular/core';
import { IdentityResultBetaBatch } from '@models/identity-query.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { SetGravitySelectedPlayerIdentities } from './gravity-gifting.state.actions';

/** Defines the user state model. */
export class GravityGiftingStateModel {
  public selectedPlayerIdentities: IdentityResultBetaBatch;
}

@Injectable({
  providedIn: 'root',
})
@State<GravityGiftingStateModel>({
  name: 'gravityGifting',
  defaults: {
    selectedPlayerIdentities: [],
  },
})
/** Defines the gravity gifting page stte. */
export class GravityGiftingState {
  /** Sets the gifting page's selected player identities. */
  @Action(SetGravitySelectedPlayerIdentities, { cancelUncompleted: true })
  public setFakeApi(
    ctx: StateContext<GravityGiftingStateModel>,
    action: SetGravitySelectedPlayerIdentities,
  ): Observable<GravityGiftingStateModel> {
    return of(ctx.patchState({ selectedPlayerIdentities: action.selectedPlayerIdentities }));
  }

  /** Selector for state selected player identities. */
  @Selector()
  public static selectedPlayerIdentities(state: GravityGiftingStateModel): IdentityResultBetaBatch {
    return state.selectedPlayerIdentities;
  }
}
