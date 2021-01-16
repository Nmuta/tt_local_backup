import { Injectable } from '@angular/core';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import {
  SetSunriseGiftingMatTabIndex,
  SetSunriseGiftingSelectedPlayerIdentities,
} from './sunrise-gifting.state.actions';

/** Defines the sunrise gifting state model. */
export class SunriseGiftingStateModel {
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
  public selectedMatIndex: number;
}

/** Defines the sunrise gifting page state. */
@Injectable({
  providedIn: 'root',
})
@State<Partial<SunriseGiftingStateModel>>({
  name: 'sunriseGifting',
  defaults: {
    selectedPlayerIdentities: [],
    selectedMatIndex: 0,
  },
})
export class SunriseGiftingState {
  /** Sets the gifting page's selected player identities. */
  @Action(SetSunriseGiftingSelectedPlayerIdentities, { cancelUncompleted: true })
  public setSunriseSelectedPlayerIdentities(
    ctx: StateContext<SunriseGiftingStateModel>,
    action: SetSunriseGiftingSelectedPlayerIdentities,
  ): Observable<SunriseGiftingStateModel> {
    return of(ctx.patchState({ selectedPlayerIdentities: action.selectedPlayerIdentities }));
  }

  /** Sets the gifting page's selected mat tab index. */
  @Action(SetSunriseGiftingMatTabIndex, { cancelUncompleted: true })
  public setSunriseMatTabIndex(
    ctx: StateContext<SunriseGiftingStateModel>,
    action: SetSunriseGiftingMatTabIndex,
  ): Observable<SunriseGiftingStateModel> {
    return of(ctx.patchState({ selectedMatIndex: action.selectedMatIndex }));
  }

  /** Selector for state selected player identities. */
  @Selector()
  public static selectedPlayerIdentities(
    state: SunriseGiftingStateModel,
  ): IdentityResultAlphaBatch {
    return state.selectedPlayerIdentities;
  }

  /** Selector for state selected mat tab index. */
  @Selector()
  public static selectedMatTabIndex(state: SunriseGiftingStateModel): number {
    return state.selectedMatIndex;
  }
}
