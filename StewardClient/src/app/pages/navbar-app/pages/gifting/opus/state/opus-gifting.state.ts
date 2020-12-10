import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { SetOpusSelectedPlayerIdentities } from './opus-gifting.state.actions';

/** Defines the opus gifting state model. */
export class OpusGiftingStateModel {
  public selectedPlayerIdentities: unknown[];
}

@Injectable({
  providedIn: 'root',
})
@State<Partial<OpusGiftingStateModel>>({
  name: 'opusGifting',
  defaults: {
    selectedPlayerIdentities: [],
  },
})
/** Defines the opus gifting page stte. */
export class OpusGiftingState {
  /** Sets the gifting page's selected player identities. */
  @Action(SetOpusSelectedPlayerIdentities, { cancelUncompleted: true })
  public setFakeApi(
    ctx: StateContext<OpusGiftingStateModel>,
    action: SetOpusSelectedPlayerIdentities,
  ): Observable<OpusGiftingStateModel> {
    return of(ctx.patchState({ selectedPlayerIdentities: action.selectedPlayerIdentities }));
  }

  /** Selector for state selected player identities. */
  @Selector()
  public static selectedPlayerIdentities(state: OpusGiftingStateModel): unknown[] {
    return state.selectedPlayerIdentities;
  }
}
