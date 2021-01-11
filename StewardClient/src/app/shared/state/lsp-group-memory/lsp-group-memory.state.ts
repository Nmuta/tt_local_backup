import { Injectable } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { Action, State, StateContext } from '@ngxs/store';
import { ApolloService } from '@services/apollo';
import { SunriseService } from '@services/sunrise';
import { Observable, of, throwError } from 'rxjs';
import { GetLspGroups } from './lsp-group-memory.actions';
import { LspGroup, LspGroups } from '@models/lsp-group';
import { map } from 'rxjs/operators';


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
  public updateToolTitle(
    ctx: StateContext<LspGroupMemoryModel>,
    action: GetLspGroups,
  ): Observable<LspGroups> {
    const state = ctx.getState();
    const title = action.title;

    // Handle unsupported titles
    if(title === GameTitleCodeName.Street || title === GameTitleCodeName.FH3) {
      return throwError(`${title} is not currently setup to handle LSP groups.`); 
    }

    // Check if memory already has lsp groups
    if(state[title].length > 0) {
      return of(state[title]);
    }

    // Request lsp groups
    const request = title === GameTitleCodeName.FH4
      ? this.sunriseService.getLspGroups() 
      : this.apolloService.getLspGroups();

    return request.pipe(
      map(data => {
        ctx.patchState({ [title]: data })
        return data;
      }),
    );
  }
}
