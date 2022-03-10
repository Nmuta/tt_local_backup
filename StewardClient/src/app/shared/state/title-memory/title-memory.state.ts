import { Injectable } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { clone } from 'lodash';
import { Observable, of } from 'rxjs';
import { UpdateTitleMemory } from './title-memory.actions';
import { TitleMemoryModel } from './title-memory.model';

/**
 *
 */
@State<TitleMemoryModel>({
  name: 'titleMemory',
  defaults: {
    gifting: GameTitleCodeName.FH5,
    banning: GameTitleCodeName.FH5,
    giftHistory: GameTitleCodeName.FH5,
    userDetails: GameTitleCodeName.FH5,
    ugc: GameTitleCodeName.FH5,
    notifications: GameTitleCodeName.FH5,
    auctionBlocklist: GameTitleCodeName.FH5,
    auctionDetails: GameTitleCodeName.FH5,
    leaderboards: GameTitleCodeName.FH5,
    racersCup: GameTitleCodeName.FM8,
  },
})
@Injectable()
/** Defines the user state. */
export class TitleMemoryState {
  /** Updates the last gifting page title. */
  @Action(UpdateTitleMemory, { cancelUncompleted: true })
  public updateToolTitle$(
    ctx: StateContext<TitleMemoryModel>,
    action: UpdateTitleMemory,
  ): Observable<TitleMemoryModel> {
    const state = ctx.getState();

    if (state[action.tool] !== action.title) {
      ctx.patchState({ [action.tool]: clone(action.title) });
    }
    return of(ctx.getState());
  }

  /** Plain selector. */
  @Selector()
  public static model(state: TitleMemoryModel): TitleMemoryModel {
    return state;
  }
}
