import { Injectable } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { Action, State, StateContext, Selector } from '@ngxs/store';
import { SunriseService } from '@services/sunrise';
import { Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GravityService } from '@services/gravity';
import { SunriseMasterInventory } from '@models/sunrise/sunrise-master-inventory.model';
import { GravityMasterInventory } from '@models/gravity/gravity-master-inventory.model';
import {
  GetApolloMasterInventoryList,
  GetGravityMasterInventoryList,
  GetSunriseMasterInventoryList,
} from './master-inventory-list-memory.actions';
import { GravityMasterInventoryLists } from '@models/gravity/gravity-master-inventory-list.model';
import { ApolloMasterInventory } from '@models/apollo';
import { ApolloService } from '@services/apollo';

/**
 * Defines the master inventory list memory model.
 */
export class MasterInventoryListMemoryModel {
  public [GameTitleCodeName.Street]: GravityMasterInventoryLists;
  public [GameTitleCodeName.FH4]: SunriseMasterInventory;
  public [GameTitleCodeName.FM7]: ApolloMasterInventory;
}

@Injectable()
@State<MasterInventoryListMemoryModel>({
  name: 'giftingMasterListMemory',
  defaults: {
    [GameTitleCodeName.Street]: {},
    [GameTitleCodeName.FH4]: undefined,
    [GameTitleCodeName.FM7]: undefined,
  },
})
/** Defines the lsp group memoty state. */
export class MasterInventoryListMemoryState {
  constructor(
    protected readonly gravityService: GravityService,
    protected readonly sunriseService: SunriseService,
    protected readonly apolloService: ApolloService,
  ) {}

  /** Gets gravity's master inventory list. */
  @Action(GetGravityMasterInventoryList, { cancelUncompleted: true })
  public getGravityMasterInventoryList(
    ctx: StateContext<MasterInventoryListMemoryModel>,
    action: GetGravityMasterInventoryList,
  ): Observable<GravityMasterInventory> {
    const state = ctx.getState();
    const gameSettingsId = action.gameSettingsId;

    // Error handling
    if (!gameSettingsId) {
      return throwError('Game settings ID is required to get a gravity master inventory list.');
    }

    // Memory check
    if (!!state[GameTitleCodeName.Street][gameSettingsId]) {
      return of(state[GameTitleCodeName.Street][gameSettingsId]);
    }

    // If not found in memory, make request
    const request$ = this.gravityService.getGameSettings(gameSettingsId);
    return request$.pipe(
      tap(data => {
        const gravityVal = state[GameTitleCodeName.Street];
        gravityVal[gameSettingsId] = data;
        ctx.patchState({ [GameTitleCodeName.Street]: gravityVal });
      }),
    );
  }

  /** Gets sunrise's master inventory list. */
  @Action(GetSunriseMasterInventoryList, { cancelUncompleted: true })
  public getSunriseMasterInventoryList(
    ctx: StateContext<MasterInventoryListMemoryModel>,
  ): Observable<SunriseMasterInventory> {
    const state = ctx.getState();

    // Memory check
    if (!!state[GameTitleCodeName.FH4]) {
      return of(state[GameTitleCodeName.FH4]);
    }

    // If not found in memory, make request
    const request$ = this.sunriseService.getMasterInventory();
    return request$.pipe(
      tap(data => {
        ctx.patchState({ [GameTitleCodeName.FH4]: data });
      }),
    );
  }

  /** Gets apollo's master inventory list. */
  @Action(GetApolloMasterInventoryList, { cancelUncompleted: true })
  public getApolloMasterInventoryList(
    ctx: StateContext<MasterInventoryListMemoryModel>,
  ): Observable<ApolloMasterInventory> {
    const state = ctx.getState();

    // Memory check
    if (!!state[GameTitleCodeName.FM7]) {
      return of(state[GameTitleCodeName.FM7]);
    }

    // If not found in memory, make request
    const request$ = this.apolloService.getMasterInventory();
    return request$.pipe(
      tap(data => {
        ctx.patchState({ [GameTitleCodeName.FM7]: data });
      }),
    );
  }

  /** Gravity master inventory list. */
  @Selector()
  public static gravityMasterInventory(
    state: MasterInventoryListMemoryModel,
  ): GravityMasterInventoryLists {
    return state[GameTitleCodeName.Street];
  }

  /** Sunrise master inventory list. */
  @Selector()
  public static sunriseMasterInventory(
    state: MasterInventoryListMemoryModel,
  ): SunriseMasterInventory {
    return state[GameTitleCodeName.FH4];
  }

  /** Apollo master inventory list. */
  @Selector()
  public static apolloMasterInventory(
    state: MasterInventoryListMemoryModel,
  ): ApolloMasterInventory {
    return state[GameTitleCodeName.FM7];
  }
}
