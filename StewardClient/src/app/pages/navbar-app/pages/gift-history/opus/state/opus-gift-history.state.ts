import { Injectable } from '@angular/core';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { SetOpusGiftHistorySelectedPlayerIdentities } from './opus-gift-history.state.actions';

/** Defines the opus gift history state model. */
export class OpusGiftHistoryStateModel {
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
  public selectedMatIndex: number;
}

/** Defines the opus gift history page state. */
@Injectable({
  providedIn: 'root',
})
@State<Partial<OpusGiftHistoryStateModel>>({
  name: 'opusGiftHistory',
  defaults: {
    selectedPlayerIdentities: [],
    selectedMatIndex: 0,
  },
})
export class OpusGiftHistoryState {
  /** Sets the gift history page's selected player identities. */
  @Action(SetOpusGiftHistorySelectedPlayerIdentities, { cancelUncompleted: true })
  public setFakeApi(
    ctx: StateContext<OpusGiftHistoryStateModel>,
    action: SetOpusGiftHistorySelectedPlayerIdentities,
  ): Observable<OpusGiftHistoryStateModel> {
    return of(ctx.patchState({ selectedPlayerIdentities: action.selectedPlayerIdentities }));
  }

  /** Selector for state selected player identities. */
  @Selector()
  public static selectedPlayerIdentities(state: OpusGiftHistoryStateModel): IdentityResultAlphaBatch {
    return state.selectedPlayerIdentities;
  }

  /** Selector for state selected mat tab index. */
  @Selector()
  public static selectedMatTabIndex(state: OpusGiftHistoryStateModel): number {
    return state.selectedMatIndex;
  }
}
