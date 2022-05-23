import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { keyOf } from '@helpers/types';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { chain, cloneDeep, omit } from 'lodash';
import { Observable } from 'rxjs';
import {
  AcknowledgeAllPendingChangelogUuids,
  AcknowledgeChangelogUuids,
  AddPendingChangelogUuids,
  MarkAllChangelogUuidsAsPending,
  ResetChangelog,
  SetDisableAutomaticPopup,
  SyncChangelog,
} from './changelog.actions';
import { ChangelogModel } from './changelog.model';

const defaultModel: ChangelogModel = {
  disableAutomaticPopup: false,
  activeChangeUuids: {
    acknowledged: [],
    pending: [],
  },
};

/**
 *  The changelog model state.
 */
@State<ChangelogModel>({
  name: 'changelog',
  defaults: defaultModel,
})
@Injectable()
/** Defines the user state. */
export class ChangelogState {
  /** Sets the disable automatic popup property to given value. */
  @Action(SetDisableAutomaticPopup, { cancelUncompleted: true })
  public setDisableAutomaticPopup(
    ctx: StateContext<ChangelogModel>,
    action: SetDisableAutomaticPopup,
  ): void {
    ctx.patchState({
      disableAutomaticPopup: action.value,
    });
  }

  /** Resets the changelog. */
  @Action(ResetChangelog, { cancelUncompleted: true })
  public resetState(ctx: StateContext<ChangelogModel>, _action: ResetChangelog): Observable<void> {
    ctx.patchState(omit(defaultModel, keyOf<ChangelogModel>('disableAutomaticPopup')));
    return ctx.dispatch(new SyncChangelog());
  }

  /** Syncs the changelog. */
  @Action(SyncChangelog, { cancelUncompleted: true })
  public syncChangelogOnStart(ctx: StateContext<ChangelogModel>, _action: SyncChangelog): void {
    const state = ctx.getState();
    const newState = cloneDeep(state);

    const activeChangeIds = chain(environment.changelog.active)
      .flatMap(g => g.entries.flatMap(e => e.uuid))
      .uniq()
      .value();
    const activeChangeIdLookup = new Set(activeChangeIds);

    // new state should only have active change IDs
    newState.activeChangeUuids.acknowledged = newState.activeChangeUuids.acknowledged.filter(v =>
      activeChangeIdLookup.has(v),
    );
    newState.activeChangeUuids.pending = newState.activeChangeUuids.pending.filter(v =>
      activeChangeIdLookup.has(v),
    );

    const acknowledgedLookup = new Set(newState.activeChangeUuids.acknowledged);
    const pendingLookup = new Set(newState.activeChangeUuids.pending);
    for (const changeId of activeChangeIds) {
      const isNewChangeId = !acknowledgedLookup.has(changeId) && !pendingLookup.has(changeId);
      if (isNewChangeId) {
        newState.activeChangeUuids.pending.push(changeId);
      }
    }

    ctx.patchState(newState);
  }

  /** Adds a number of changelog UUIDs to the active list (removing them from the pending list). */
  @Action(AcknowledgeChangelogUuids, { cancelUncompleted: true })
  public acknowledgeChangelogUuids(
    ctx: StateContext<ChangelogModel>,
    action: AcknowledgeChangelogUuids,
  ): void {
    const state = ctx.getState();

    const acknowledgedLookup = new Set(state.activeChangeUuids.acknowledged);
    const pendingLookup = new Set(state.activeChangeUuids.pending);
    for (const uuid of action.uuids) {
      acknowledgedLookup.add(uuid);
      pendingLookup.delete(uuid);
    }

    ctx.patchState({
      activeChangeUuids: {
        acknowledged: Array.from(acknowledgedLookup),
        pending: Array.from(pendingLookup),
      },
    });
  }

  /** Adds a number of changelog UUIDs to the pending list (removing them from the acknowledged list). */
  @Action(AddPendingChangelogUuids, { cancelUncompleted: true })
  public addPendingChangelogUuids(
    ctx: StateContext<ChangelogModel>,
    action: AddPendingChangelogUuids,
  ): void {
    const state = ctx.getState();

    const acknowledgedLookup = new Set(state.activeChangeUuids.acknowledged);
    const pendingLookup = new Set(state.activeChangeUuids.pending);
    for (const uuid of action.uuids) {
      acknowledgedLookup.delete(uuid);
      pendingLookup.add(uuid);
    }

    ctx.patchState({
      activeChangeUuids: {
        acknowledged: Array.from(acknowledgedLookup),
        pending: Array.from(pendingLookup),
      },
    });
  }

  /** Acknowledges all pending changelog UUIDs. */
  @Action(AcknowledgeAllPendingChangelogUuids, { cancelUncompleted: true })
  public acknowledgeAllPendingChangelogUuids(
    ctx: StateContext<ChangelogModel>,
    _action: AcknowledgeAllPendingChangelogUuids,
  ): void {
    const state = ctx.getState();

    ctx.patchState({
      activeChangeUuids: {
        acknowledged: [...state.activeChangeUuids.acknowledged, ...state.activeChangeUuids.pending],
        pending: [],
      },
    });
  }

  /** Marks all changelog UUIDs as pending. */
  @Action(MarkAllChangelogUuidsAsPending, { cancelUncompleted: true })
  public markAllChangelogUuidsAsPending(
    ctx: StateContext<ChangelogModel>,
    _action: MarkAllChangelogUuidsAsPending,
  ): void {
    const state = ctx.getState();

    ctx.patchState({
      activeChangeUuids: {
        acknowledged: [],
        pending: [...state.activeChangeUuids.acknowledged, ...state.activeChangeUuids.pending],
      },
    });
  }

  /** Selector for state pending UUIDs. */
  @Selector()
  public static allPendingIds(state: ChangelogModel): string[] {
    return state.activeChangeUuids.pending;
  }
}
