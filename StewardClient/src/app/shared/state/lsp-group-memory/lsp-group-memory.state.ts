import { Injectable } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { Action, State, StateContext, Selector } from '@ngxs/store';
import { ApolloService } from '@services/apollo';
import { SunriseService } from '@services/sunrise';
import { Observable, of, throwError } from 'rxjs';
import { GetLspGroups } from './lsp-group-memory.actions';
import { LspGroup, LspGroups } from '@models/lsp-group';
import { tap } from 'rxjs/operators';
import { clone } from 'lodash';
import { SteelheadService } from '@services/steelhead';
import { WoodstockService } from '@services/woodstock';

/**
 * Defines the lsp group memory model.
 */
export class LspGroupMemoryModel {
  public [GameTitleCodeName.FH4]: LspGroup[];
  public [GameTitleCodeName.FM7]: LspGroup[];
  public [GameTitleCodeName.FM8]: LspGroup[];
  public [GameTitleCodeName.FH5]: LspGroup[];
}

@Injectable()
@State<LspGroupMemoryModel>({
  name: 'lspGroupMemory',
  defaults: {
    [GameTitleCodeName.FH4]: [],
    [GameTitleCodeName.FM7]: [],
    [GameTitleCodeName.FM8]: [],
    [GameTitleCodeName.FH5]: [],
  },
})
/** Defines the lsp group memoty state. */
export class LspGroupMemoryState {
  constructor(
    private readonly sunriseService: SunriseService,
    private readonly apolloService: ApolloService,
    private readonly steelheadService: SteelheadService,
    private readonly woodstockService: WoodstockService,
  ) {}

  /** Updates the last gifting page title. */
  @Action(GetLspGroups, { cancelUncompleted: true })
  public getLspGroups(
    ctx: StateContext<LspGroupMemoryModel>,
    action: GetLspGroups,
  ): Observable<LspGroups> {
    const state = ctx.getState();
    const title = action.title;

    // Check if memory already has lsp groups
    if (!!state[title] && state[title].length > 0) {
      return of(state[title]);
    }

    // Set request to get lsp groups
    let request$: Observable<LspGroups>;
    switch (title) {
      case GameTitleCodeName.FH4:
        request$ = this.sunriseService.getLspGroups();
        break;
      case GameTitleCodeName.FM7:
        request$ = this.apolloService.getLspGroups();
        break;
      case GameTitleCodeName.FM8:
        request$ = this.steelheadService.getLspGroups();
        break;
      case GameTitleCodeName.FH5:
        request$ = this.woodstockService.getLspGroups();
        break;
      default:
        return throwError(`${title} is not currently setup to handle LSP groups.`);
    }

    return request$.pipe(
      tap(data => {
        ctx.patchState({ [title]: clone(data) });
      }),
    );
  }

  /** Woodstock lsp groups selector. */
  @Selector()
  public static WoodstockLspGroups(state: LspGroupMemoryModel): LspGroups {
    return state.Woodstock;
  }

  /** Steelhead lsp groups selector. */
  @Selector()
  public static steelheadLspGroups(state: LspGroupMemoryModel): LspGroups {
    return state.Steelhead;
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
