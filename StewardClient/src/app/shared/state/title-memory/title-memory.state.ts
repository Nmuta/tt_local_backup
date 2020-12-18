import { Injectable } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { UpdateTitleMemory } from './title-memory.actions';
import { TitleMemoryModel } from './title-memory.model';

@Injectable()
@State<TitleMemoryModel>({
  name: 'titleMemory',
  defaults: {
    gifting: GameTitleCodeName.Street,
  },
})
/** Defines the user state. */
export class TitleMemoryState {
  /** Updates the last gifting page title. */
  @Action(UpdateTitleMemory, { cancelUncompleted: true })
  public updateToolTitle(
    ctx: StateContext<TitleMemoryModel>,
    action: UpdateTitleMemory,
  ): Observable<TitleMemoryModel> {
    const state = ctx.getState();

    if (state[action.tool] !== action.title) {
      ctx.patchState({ [action.tool]: action.title });
    }
    return of(ctx.getState());
  }

  /** Plain selector. */
  @Selector()
  public static model(state: TitleMemoryModel): TitleMemoryModel {
    return state;
  }
}