import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { SetSunriseSelectedPlayerIdentities } from './sunrise-gifting.state.actions';

/** Defines the sunrise gifting state model. */
export class SunriseGiftingStateModel {
  public selectedPlayerIdentities: unknown[];
}

@Injectable({
  providedIn: 'root',
})
@State<Partial<SunriseGiftingStateModel>>({
  name: 'sunriseGifting',
  defaults: {
    selectedPlayerIdentities: [],
  },
})
/** Defines the sunrise gifting page stte. */
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
  public static selectedPlayerIdentities(state: SunriseGiftingStateModel): unknown[] {
    return state.selectedPlayerIdentities;
  }
}
