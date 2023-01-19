import { Injectable } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { clone } from 'lodash';
import { Observable, of } from 'rxjs';
import { UpdateRouteMemory } from './route-memory.actions';
import { RouteMemoryModel } from './route-memory.model';

/**
 *  Route memory state
 */
@State<RouteMemoryModel>({
  name: 'routeMemory',
  defaults: {
    ugcDetails: `${GameTitleCodeName.FH5}`,
    auctionDetails: `${GameTitleCodeName.FH5}`,
    carDetails: `${GameTitleCodeName.FH5}`,
    gifting: `${GameTitleCodeName.FH5}`,
    buildersCupCalendar: `${GameTitleCodeName.FM8}`,
  },
})
@Injectable()
/** Defines the user state. */
export class RouteMemoryState {
  /** Updates the last gifting page title. */
  @Action(UpdateRouteMemory, { cancelUncompleted: true })
  public updateToolTitle$(
    ctx: StateContext<RouteMemoryModel>,
    action: UpdateRouteMemory,
  ): Observable<RouteMemoryModel> {
    const state = ctx.getState();

    if (state[action.tool] !== action.routePath) {
      ctx.patchState({ [action.tool]: clone(action.routePath) });
    }
    return of(ctx.getState());
  }

  /** Plain selector. */
  @Selector()
  public static model(state: RouteMemoryModel): RouteMemoryModel {
    return state;
  }
}
