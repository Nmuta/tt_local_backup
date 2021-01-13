import { Injectable } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { Action, State, StateContext, Selector } from '@ngxs/store';
import { SunriseService } from '@services/sunrise';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GravityService } from '@services/gravity';
import { SunriseMasterInventory } from '@models/sunrise/sunrise-master-inventory.model';
import { GravityMasterInventory } from '@models/gravity/gravity-master-inventory.model';
import { GetMasterInventoryList } from './master-inventory-list-memory.actions';
import { GravityMasterInventoryLists } from '@models/gravity/gravity-master-inventory-list.model';


type MasterInventoryUnion = GravityMasterInventory | SunriseMasterInventory;

/**
 * Defines the master inventory list memory model.
 */
export class MasterInventoryListMemoryModel {
  public [GameTitleCodeName.Street]: GravityMasterInventoryLists;
  public [GameTitleCodeName.FH4]: SunriseMasterInventory;
}

@Injectable()
@State<MasterInventoryListMemoryModel>({
  name: 'giftingMasterListMemory',
  defaults: {
    [GameTitleCodeName.Street]: {},
    [GameTitleCodeName.FH4]: undefined,
  },
})
/** Defines the lsp group memoty state. */
export class MasterInventoryListMemoryState {
  constructor(
    protected readonly gravityService: GravityService,
    protected readonly sunriseService: SunriseService,
  ) {}

  /** Updates the last gifting page title. */
  @Action(GetMasterInventoryList, { cancelUncompleted: true })
  public getItemMasterList(
    ctx: StateContext<MasterInventoryListMemoryModel>,
    action: GetMasterInventoryList,
  ): void {
    const state = ctx.getState();
    const title = action.title;
    const gameSettingsId = action.gameSettingsId;

    // Error handling
    if(title === GameTitleCodeName.Street && !gameSettingsId) {
      return;
    }

    if(title === GameTitleCodeName.FH4 && !!gameSettingsId) {
      return;
    }

    // Memory check
    if(title === GameTitleCodeName.Street) {
      if (!!state[title] && !!state[title][gameSettingsId]) {
        return;
      }
    }

    if(title === GameTitleCodeName.FH4) {
      if (!!state[title]) {
        return;
      }
    }
    console.log(state);
    // Not found in memory, make request
    let request$: Observable<MasterInventoryUnion>;
    switch (title) {
      case GameTitleCodeName.Street:
        request$ = this.gravityService.getGameSettings(gameSettingsId);
        break;
      case GameTitleCodeName.FH4:
        request$ = this.sunriseService.getMasterInventory();
        break;
      default:
        return;
    }

    request$.pipe(
      tap(data => {
        if(title === GameTitleCodeName.Street) {
          const gravityVal = state[title];
          console.log(gravityVal);
          gravityVal[gameSettingsId] = data;
          ctx.patchState({ [title]: gravityVal });
        }

        if(title === GameTitleCodeName.FH4) {
          ctx.patchState({ [title]: data });
        }
      }),
    );
  }

  /** Gravity master inventory list. */
  @Selector()
  public static gravityMasterInventory(state: MasterInventoryListMemoryModel): GravityMasterInventoryLists {
    return state.Gravity;
  }

  /** Sunrise master inventory list. */
  @Selector()
  public static sunriseMasterInventory(state: MasterInventoryListMemoryModel): SunriseMasterInventory {
    return state.Sunrise;
  }
}
