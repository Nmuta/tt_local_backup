import { Injectable } from '@angular/core';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { SetOpusSelectedPlayerIdentities } from './opus-gifting.state.actions';

/** Defines the opus gifting state model. */
export class OpusGiftingStateModel {
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
}

/** Defines the opus gifting page state. */
@Injectable({
  providedIn: 'root',
})
@State<OpusGiftingStateModel>({
  name: 'opusGifting',
  defaults: {
    selectedPlayerIdentities: [],
  },
})
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
  public static selectedPlayerIdentities(state: OpusGiftingStateModel): IdentityResultAlphaBatch {
    return state.selectedPlayerIdentities;
  }
}
