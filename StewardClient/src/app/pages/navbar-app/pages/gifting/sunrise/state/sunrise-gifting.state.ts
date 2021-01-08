import { Injectable } from '@angular/core';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { SetSunriseSelectedPlayerIdentities } from './sunrise-gifting.state.actions';

/** Defines the sunrise gifting state model. */
export class SunriseGiftingStateModel {
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
}

/** Defines the sunrise gifting page state. */
@Injectable({
  providedIn: 'root',
})
@State<Partial<SunriseGiftingStateModel>>({
  name: 'sunriseGifting',
  defaults: {
    selectedPlayerIdentities: [],
  },
})
export class SunriseGiftingState {
  /** Sets the gifting page's selected player identities. */
  @Action(SetSunriseSelectedPlayerIdentities, { cancelUncompleted: true })
  public setFakeApi(
    ctx: StateContext<SunriseGiftingStateModel>,
    action: SetSunriseSelectedPlayerIdentities,
  ): Observable<SunriseGiftingStateModel> {
    return of(ctx.patchState({ selectedPlayerIdentities: action.selectedPlayerIdentities }));
  }

  /** Selector for state selected player identities. */
  @Selector()
  public static selectedPlayerIdentities(
    state: SunriseGiftingStateModel,
  ): IdentityResultAlphaBatch {
    return state.selectedPlayerIdentities;
  }
}
