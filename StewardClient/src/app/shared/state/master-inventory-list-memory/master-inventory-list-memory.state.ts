import { Injectable } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { Action, State, StateContext, Selector } from '@ngxs/store';
import { SunriseService } from '@services/sunrise';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  GetApolloMasterInventoryList,
  GetSteelheadMasterInventoryList,
  GetSunriseMasterInventoryList,
  GetWoodstockMasterInventoryList,
} from './master-inventory-list-memory.actions';
import { ApolloMasterInventory } from '@models/apollo';
import { ApolloService } from '@services/apollo';
import { clone } from 'lodash';
import { SunriseMasterInventory } from '@models/sunrise';
import { SteelheadMasterInventory } from '@models/steelhead';
import { WoodstockMasterInventory } from '@models/woodstock';
import { WoodstockService } from '@services/woodstock';
import { SteelheadItemsService } from '@services/api-v2/steelhead/items/steelhead-items.service';

/**
 * Defines the master inventory list memory model.
 */
export class MasterInventoryListMemoryModel {
  public [GameTitleCodeName.FH4]: SunriseMasterInventory;
  public [GameTitleCodeName.FM7]: ApolloMasterInventory;
  public [GameTitleCodeName.FM8]: SteelheadMasterInventory;
  public [GameTitleCodeName.FH5]: WoodstockMasterInventory;
}

/**
 * Master inventory Ngxs model state.
 */
@State<MasterInventoryListMemoryModel>({
  name: 'giftingMasterListMemory',
  defaults: {
    [GameTitleCodeName.FH4]: undefined,
    [GameTitleCodeName.FM7]: undefined,
    [GameTitleCodeName.FM8]: undefined,
    [GameTitleCodeName.FH5]: undefined,
  },
})
@Injectable()
/** Defines the lsp group memoty state. */
export class MasterInventoryListMemoryState {
  constructor(
    private readonly sunriseService: SunriseService,
    private readonly apolloService: ApolloService,
    private readonly steelheadItemsService: SteelheadItemsService,
    private readonly woodstockService: WoodstockService,
  ) {}

  /** Gets woodstocks's master inventory list. */
  @Action(GetWoodstockMasterInventoryList, { cancelUncompleted: true })
  public getWoodstockMasterInventoryList$(
    ctx: StateContext<MasterInventoryListMemoryModel>,
  ): Observable<WoodstockMasterInventory> {
    const state = ctx.getState();

    // Memory check
    if (!!state[GameTitleCodeName.FH5]) {
      return of(state[GameTitleCodeName.FH5]);
    }

    // If not found in memory, make request
    const request$ = this.woodstockService.getMasterInventory$();
    return request$.pipe(
      tap(data => {
        ctx.patchState({ [GameTitleCodeName.FH5]: clone(data) });
      }),
    );
  }

  /** Gets steelhead's master inventory list. */
  @Action(GetSteelheadMasterInventoryList, { cancelUncompleted: true })
  public getSteelheadMasterInventoryList$(
    ctx: StateContext<MasterInventoryListMemoryModel>,
  ): Observable<SteelheadMasterInventory> {
    const state = ctx.getState();

    // Memory check
    if (!!state[GameTitleCodeName.FM8]) {
      return of(state[GameTitleCodeName.FM8]);
    }

    // If not found in memory, make request
    const request$ = this.steelheadItemsService.getMasterInventory$();
    return request$.pipe(
      tap(data => {
        ctx.patchState({ [GameTitleCodeName.FM8]: clone(data) });
      }),
    );
  }

  /** Gets sunrise's master inventory list. */
  @Action(GetSunriseMasterInventoryList, { cancelUncompleted: true })
  public getSunriseMasterInventoryList$(
    ctx: StateContext<MasterInventoryListMemoryModel>,
  ): Observable<SunriseMasterInventory> {
    const state = ctx.getState();

    // Memory check
    if (!!state[GameTitleCodeName.FH4]) {
      return of(state[GameTitleCodeName.FH4]);
    }

    // If not found in memory, make request
    const request$ = this.sunriseService.getMasterInventory$();
    return request$.pipe(
      tap(data => {
        ctx.patchState({ [GameTitleCodeName.FH4]: clone(data) });
      }),
    );
  }

  /** Gets apollo's master inventory list. */
  @Action(GetApolloMasterInventoryList, { cancelUncompleted: true })
  public getApolloMasterInventoryList$(
    ctx: StateContext<MasterInventoryListMemoryModel>,
  ): Observable<ApolloMasterInventory> {
    const state = ctx.getState();

    // Memory check
    if (!!state[GameTitleCodeName.FM7]) {
      return of(state[GameTitleCodeName.FM7]);
    }

    // If not found in memory, make request
    const request$ = this.apolloService.getMasterInventory$();
    return request$.pipe(
      tap(data => {
        ctx.patchState({ [GameTitleCodeName.FM7]: clone(data) });
      }),
    );
  }

  /** Woodstock master inventory list. */
  @Selector()
  public static woodstockMasterInventory(
    state: MasterInventoryListMemoryModel,
  ): WoodstockMasterInventory {
    return state[GameTitleCodeName.FH5];
  }

  /** Steelhead master inventory list. */
  @Selector()
  public static steelheadMasterInventory(
    state: MasterInventoryListMemoryModel,
  ): SteelheadMasterInventory {
    return state[GameTitleCodeName.FM8];
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
