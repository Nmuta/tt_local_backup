import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { SetHomeTour, SetUserTours } from './tours.actions';

/** Defines the tours state model. */
export class TourStateModel {
  public enableHomeTour: boolean;
  public enableUserTours: boolean;
}

/** Defines the current user's tour settings. */
@State<TourStateModel>({
  name: 'tour',
  defaults: {
    enableHomeTour: true,
    enableUserTours: true,
  },
})
@Injectable()
export class TourState {
  constructor(private readonly store: Store) {}

  /** Sets the state of the Home tour. */
  @Action(SetHomeTour, { cancelUncompleted: true })
  public setHomeTour$(
    ctx: StateContext<TourStateModel>,
    action: SetHomeTour,
  ): Observable<TourStateModel> {
    return of(ctx.patchState({ enableHomeTour: action.enabled }));
  }

  /** Sets the state of all the user tours. */
  @Action(SetUserTours, { cancelUncompleted: true })
  public setUserTours$(
    ctx: StateContext<TourStateModel>,
    action: SetUserTours,
  ): Observable<TourStateModel> {
    return of(ctx.patchState({ enableUserTours: action.enabled }));
  }

  /** Selector for whether the state has the home tour enabled. */
  @Selector()
  public static enableHomeTour(state: TourStateModel): boolean {
    if (state.enableHomeTour === undefined) {
      return true;
    }

    return state.enableHomeTour;
  }

  /** Selector for whether the state has all the user tours enabled. */
  @Selector()
  public static enableUserTours(state: TourStateModel): boolean {
    if (state.enableUserTours === undefined) {
      return true;
    }
    return state.enableUserTours;
  }
}
