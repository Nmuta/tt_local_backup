import { Injectable } from '@angular/core';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { clone } from 'lodash';
import { Observable, of } from 'rxjs';
import {
  SetSunriseGiftHistorySelectedPlayerIdentities,
  SetSunriseGiftHistoryMatTabIndex,
} from './sunrise-gift-history.state.actions';

/** Defines the sunrise gift history state model. */
export class SunriseGiftHistoryStateModel {
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
  public selectedMatIndex: number;
}

/** Defines the sunrise gift history page state. */
@Injectable({
  providedIn: 'root',
})
@State<Partial<SunriseGiftHistoryStateModel>>({
  name: 'sunriseGiftHistory',
  defaults: {
    selectedPlayerIdentities: [],
    selectedMatIndex: 0,
  },
})
export class SunriseGiftHistoryState {
  /** Sets the gift history page's selected player identities. */
  @Action(SetSunriseGiftHistorySelectedPlayerIdentities, { cancelUncompleted: true })
  public setFakeApi(
    ctx: StateContext<SunriseGiftHistoryStateModel>,
    action: SetSunriseGiftHistorySelectedPlayerIdentities,
  ): Observable<SunriseGiftHistoryStateModel> {
    return of(ctx.patchState({ selectedPlayerIdentities: clone(action.selectedPlayerIdentities) }));
  }

  /** Sets the gift history page's selected mat tab index. */
  @Action(SetSunriseGiftHistoryMatTabIndex, { cancelUncompleted: true })
  public setSunriseMatTabIndex(
    ctx: StateContext<SunriseGiftHistoryStateModel>,
    action: SetSunriseGiftHistoryMatTabIndex,
  ): Observable<SunriseGiftHistoryStateModel> {
    return of(ctx.patchState({ selectedMatIndex: clone(action.selectedMatIndex) }));
  }

  /** Selector for state selected player identities. */
  @Selector()
  public static selectedPlayerIdentities(
    state: SunriseGiftHistoryStateModel,
  ): IdentityResultAlphaBatch {
    return state.selectedPlayerIdentities;
  }

  /** Selector for state selected mat tab index. */
  @Selector()
  public static selectedMatTabIndex(state: SunriseGiftHistoryStateModel): number {
    return state.selectedMatIndex;
  }
}
