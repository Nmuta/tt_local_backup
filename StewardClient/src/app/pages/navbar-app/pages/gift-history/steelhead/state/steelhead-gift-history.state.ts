import { Injectable } from '@angular/core';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { clone } from 'lodash';
import { Observable, of } from 'rxjs';
import {
  SetSteelheadGiftHistorySelectedPlayerIdentities,
  SetSteelheadGiftHistoryMatTabIndex,
} from './steelhead-gift-history.state.actions';

/** Defines the steelhead gift history state model. */
export class SteelheadGiftHistoryStateModel {
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
  public selectedMatIndex: number;
}

/** Defines the steelhead gift history page state. */
@State<Partial<SteelheadGiftHistoryStateModel>>({
  name: 'steelheadGiftHistory',
  defaults: {
    selectedPlayerIdentities: [],
    selectedMatIndex: 0,
  },
})
@Injectable({
  providedIn: 'root',
})
export class SteelheadGiftHistoryState {
  /** Sets the gift history page's selected player identities. */
  @Action(SetSteelheadGiftHistorySelectedPlayerIdentities, { cancelUncompleted: true })
  public setFakeApi$(
    ctx: StateContext<SteelheadGiftHistoryStateModel>,
    action: SetSteelheadGiftHistorySelectedPlayerIdentities,
  ): Observable<SteelheadGiftHistoryStateModel> {
    return of(ctx.patchState({ selectedPlayerIdentities: clone(action.selectedPlayerIdentities) }));
  }

  /** Sets the gift history page's selected mat tab index. */
  @Action(SetSteelheadGiftHistoryMatTabIndex, { cancelUncompleted: true })
  public setSteelheadMatTabIndex$(
    ctx: StateContext<SteelheadGiftHistoryStateModel>,
    action: SetSteelheadGiftHistoryMatTabIndex,
  ): Observable<SteelheadGiftHistoryStateModel> {
    return of(ctx.patchState({ selectedMatIndex: clone(action.selectedMatIndex) }));
  }

  /** Selector for state selected player identities. */
  @Selector()
  public static selectedPlayerIdentities(
    state: SteelheadGiftHistoryStateModel,
  ): IdentityResultAlphaBatch {
    return state.selectedPlayerIdentities;
  }

  /** Selector for state selected mat tab index. */
  @Selector()
  public static selectedMatTabIndex(state: SteelheadGiftHistoryStateModel): number {
    return state.selectedMatIndex;
  }
}
