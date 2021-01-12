import { Injectable } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { Action, State, StateContext, Selector } from '@ngxs/store';
import { ApolloService } from '@services/apollo';
import { SunriseService } from '@services/sunrise';
import { Observable, of, throwError } from 'rxjs';
import { GetLspGroups } from './lsp-group-memory.actions';
import { LspGroup, LspGroups } from '@models/lsp-group';
import { tap } from 'rxjs/operators';

/**
 * Defines the lsp group memory model.
 */
export class LspGroupMemoryModel {
  public [GameTitleCodeName.FH4]: LspGroup[];
  public [GameTitleCodeName.FM7]: LspGroup[];
}

@Injectable()
@State<LspGroupMemoryModel>({
  name: 'lspGroupMemory',
  defaults: {
    [GameTitleCodeName.FH4]: [],
    [GameTitleCodeName.FM7]: [],
  },
})
/** Defines the lsp group memoty state. */
export class LspGroupMemoryState {
  constructor(
    protected readonly sunriseService: SunriseService,
    protected readonly apolloService: ApolloService,
  ) {}

  /** Updates the last gifting page title. */
  @Action(GetLspGroups, { cancelUncompleted: true })
  public getLspGroups(
    ctx: StateContext<LspGroupMemoryModel>,
    action: GetLspGroups,
  ): Observable<LspGroups> {
    const state = ctx.getState();
    const title = action.title;

    // Set request to get lsp groups
    let request: Observable<LspGroups>;
    switch(title) {
      case GameTitleCodeName.FH4:
        request = this.sunriseService.getLspGroups();
        break;
      case GameTitleCodeName.FM7:
        request = this.apolloService.getLspGroups();
        break;
      default:
        return throwError(`${title} is not currently setup to handle LSP groups.`);
    }

    // Check if memory already has lsp groups
    if (state[title].length > 0) {
      return of(state[title]);
    }

    return request.pipe(
      tap(data => {
        ctx.patchState({ [title]: data });
      }),
    );
  }

  /** Sunrise lsp groups selector. */
  @Selector()
  public static sunriseLspGroups(state: LspGroupMemoryModel): LspGroups {
    return state.Sunrise;
  }

  /** Apollo lsp groups selector. */
  @Selector()
  public static apolloLspGroups(state: LspGroupMemoryModel): LspGroups {
    return state.Apollo;
  }
}
