import { Injectable } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { clone } from 'lodash';
import { Observable, of } from 'rxjs';
import { UpdateTitleMemory } from './title-memory.actions';
import { TitleMemoryModel } from './title-memory.model';

@Injectable()
@State<TitleMemoryModel>({
  name: 'titleMemory',
  defaults: {
    gifting: GameTitleCodeName.Street,
    banning: GameTitleCodeName.FH4,
    giftHistory: GameTitleCodeName.Street,
    messaging: GameTitleCodeName.FH4,
    userDetails: GameTitleCodeName.FH4,
    ugc: GameTitleCodeName.FH4,
    serviceManagement: GameTitleCodeName.FH4,
  },
})
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
