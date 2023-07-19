import { Injectable } from '@angular/core';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { clone } from 'lodash';
import { Observable, of } from 'rxjs';
import {
  SetWoodstockGiftHistorySelectedPlayerIdentities,
  SetWoodstockGiftHistoryMatTabIndex,
} from './woodstock-gift-history.state.actions';

/** Defines the woodstock gift history state model. */
export class WoodstockGiftHistoryStateModel {
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
  public selectedMatIndex: number;
}

/** Defines the woodstock gift history page state. */
@State<Partial<WoodstockGiftHistoryStateModel>>({
  name: 'woodstockGiftHistory',
  defaults: {
    selectedPlayerIdentities: [],
    selectedMatIndex: 0,
  },
})
@Injectable({
  providedIn: 'root',
})
export class WoodstockGiftHistoryState {
  /** Sets the gift history page's selected player identities. */
  @Action(SetWoodstockGiftHistorySelectedPlayerIdentities, { cancelUncompleted: true })
  public setFakeApi(
    ctx: StateContext<WoodstockGiftHistoryStateModel>,
    action: SetWoodstockGiftHistorySelectedPlayerIdentities,
  ): Observable<WoodstockGiftHistoryStateModel> {
    return of(ctx.patchState({ selectedPlayerIdentities: clone(action.selectedPlayerIdentities) }));
  }

  /** Sets the gift history page's selected mat tab index. */
  @Action(SetWoodstockGiftHistoryMatTabIndex, { cancelUncompleted: true })
  public setWoodstockMatTabIndex(
    ctx: StateContext<WoodstockGiftHistoryStateModel>,
    action: SetWoodstockGiftHistoryMatTabIndex,
  ): Observable<WoodstockGiftHistoryStateModel> {
    return of(ctx.patchState({ selectedMatIndex: clone(action.selectedMatIndex) }));
  }

  /** Selector for state selected player identities. */
  @Selector()
  public static selectedPlayerIdentities(
    state: WoodstockGiftHistoryStateModel,
  ): IdentityResultAlphaBatch {
    return state.selectedPlayerIdentities;
  }

  /** Selector for state selected mat tab index. */
  @Selector()
  public static selectedMatTabIndex(state: WoodstockGiftHistoryStateModel): number {
    return state.selectedMatIndex;
  }
}
