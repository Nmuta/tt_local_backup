import { Injectable } from '@angular/core';
import {
  ChangelogArea,
  ChangelogEntry,
  ChangelogGroup,
  isChangelogArea,
} from '@environments/app-data/changelog';
import { environment, NavbarTool } from '@environments/environment';
import { GameTitle } from '@models/enums';
import { Select, Store } from '@ngxs/store';
import {
  AcknowledgeAllPendingChangelogUuids,
  AcknowledgeChangelogUuids,
  AddPendingChangelogUuids,
  MarkAllChangelogUuidsAsPending,
  SetDisableAutomaticPopup,
} from '@shared/state/changelog/changelog.actions';
import { ChangelogModel } from '@shared/state/changelog/changelog.model';
import { ChangelogState } from '@shared/state/changelog/changelog.state';
import { Observable, ReplaySubject, startWith } from 'rxjs';

/** Convenience service for changelog state. */
@Injectable({
  providedIn: 'root',
})
export class ChangelogService {
  @Select(ChangelogState) public changelogState$: Observable<ChangelogModel>;

  public readonly changed$: Observable<void> = new ReplaySubject<void>(1);

  /** Changelog Entry ID -> Changelog Entry */
  private readonly changelogIdToEntryLookup = new Map<string, ChangelogEntry>();
  /** Changelog Entry ID -> Changelog Group (which contains the entry) */
  private readonly changelogIdToGroupLookup = new Map<string, ChangelogGroup>();
  /** Changelog Tag (`{tool}-{title}`) -> Changelog Entries */
  private readonly changelogTagToEntriesLookup = new Map<string, ChangelogEntry[]>();

  private acknowledgedIds = new Set<string>();
  private pendingIds = new Set<string>();
  private state: ChangelogModel;

  constructor(private readonly store: Store) {
    for (const changelogGroup of environment.changelog.active) {
      for (const changelogEntry of changelogGroup.entries) {
        // add it to the standard lookups
        this.changelogIdToEntryLookup.set(changelogEntry.uuid, changelogEntry);
        this.changelogIdToGroupLookup.set(changelogEntry.uuid, changelogGroup);

        // add it to the tag lookup if we can
        const tagLookupKey = this.makeTagLookupKey(changelogEntry.tag);
        if (tagLookupKey) {
          if (!this.changelogTagToEntriesLookup.has(tagLookupKey)) {
            this.changelogTagToEntriesLookup.set(tagLookupKey, []);
          }

          this.changelogTagToEntriesLookup.get(tagLookupKey).push(changelogEntry);
        }
      }
    }

    const snapshot = this.store.selectSnapshot<ChangelogModel>(ChangelogState);
    this.changelogState$.pipe(startWith(snapshot)).subscribe(state => {
      this.state = state;
      this.acknowledgedIds = new Set(state.activeChangeUuids.acknowledged);
      this.pendingIds = new Set(state.activeChangeUuids.pending);
      (this.changed$ as ReplaySubject<void>).next();
    });
  }

  /** True when the automatic popup is disabled. */
  public get disableAutomaticPopup(): boolean {
    return this.state.disableAutomaticPopup;
  }

  /** Sets the state of automatic popup disabling. */
  public set disableAutomaticPopup(value: boolean) {
    this.store.dispatch(new SetDisableAutomaticPopup(value));
  }

  /** True when all known IDs are pending. */
  public get allArePending(): boolean {
    return this.pendingIds.size > 0 && this.acknowledgedIds.size == 0;
  }

  /** True when all known IDs are acknowledged. */
  public get allAreAcknowledged(): boolean {
    return this.acknowledgedIds.size > 0 && this.pendingIds.size == 0;
  }

  /** Returns true if the given UUID is pending. */
  public isPending(uuid: string): boolean {
    return this.pendingIds.has(uuid);
  }

  /** Returns true if the given UUID is acknowledge. */
  public isAcknowledged(uuid: string): boolean {
    const acked = this.acknowledgedIds.has(uuid);
    return acked;
  }

  /** Returns true if the given UUID is neither acknowledged or pending. */
  public isIndeterminate(uuid: string): boolean {
    return !this.isPending(uuid) && !this.isAcknowledged(uuid);
  }

  /** Acknowledges all Changelog Entry UUIDs. */
  public acknowledgeAll(): void {
    this.store.dispatch(new AcknowledgeAllPendingChangelogUuids());
  }

  /** Mark all Changelog Entry UUIDs as pending. */
  public markAllPending(): void {
    this.store.dispatch(new MarkAllChangelogUuidsAsPending());
  }

  /** Acknowledges the given Changelog Entry UUIDs. */
  public acknowledge(...uuids: string[] | string[][]): void {
    this.store.dispatch(new AcknowledgeChangelogUuids(uuids.flat()));
  }

  /** Marks the given Changelog Entry UUIDs as Pending. */
  public markPending(...uuids: string[] | string[][]): void {
    this.store.dispatch(new AddPendingChangelogUuids(uuids.flat()));
  }

  /** Produces changelog entries for the given tag. */
  public getChangelogEntriesForTag(tool: NavbarTool, title: GameTitle): ChangelogEntry[] {
    const lookup = this.makeTagLookupKey({ tool, title });
    if (!this.changelogTagToEntriesLookup.has(lookup)) {
      return [];
    }

    return this.changelogTagToEntriesLookup.get(lookup);
  }

  private makeTagLookupKey(changelogEntryTag: ChangelogArea | string): string | undefined {
    if (isChangelogArea(changelogEntryTag)) {
      return `${changelogEntryTag.tool}-${changelogEntryTag.title}`;
    }

    return undefined;
  }
}
