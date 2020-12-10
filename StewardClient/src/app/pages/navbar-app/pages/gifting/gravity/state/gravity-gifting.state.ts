import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { SetGravitySelectedPlayerIdentities } from './gravity-gifting.state.actions';

/** Defines the user state model. */
export class GravityGiftingStateModel {
  public selectedPlayerIdentities: unknown[];
}

@Injectable({
  providedIn: 'root',
})
@State<Partial<GravityGiftingStateModel>>({
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
  public static selectedPlayerIdentities(state: GravityGiftingStateModel): unknown[] {
    return state.selectedPlayerIdentities;
  }
}
