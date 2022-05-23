import { Component, ViewChildren } from '@angular/core';
import { environment } from '@environments/environment';
import { Store } from '@ngxs/store';
import { ChangelogService } from '@services/changelog/changelog.service';
import {
  ResetChangelog,
  AcknowledgeAllPendingChangelogUuids,
  MarkAllChangelogUuidsAsPending,
} from '@shared/state/changelog/changelog.actions';
import { UserSettingsService } from '@shared/state/user-settings/user-settings.service';
import { ChangelogGroupComponent } from './changelog-group/changelog-group.component';

/** Displays a changelog. */
@Component({
  selector: 'changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.scss'],
})
export class ChangelogComponent {
  @ViewChildren(ChangelogGroupComponent) public changelogs: ChangelogGroupComponent[];

  public readonly changelog = environment.changelog;

  /** True when all known entries are pending. */
  public get allArePending(): boolean {
    return this.changelogService.allArePending;
  }

  /** True when all known entries are acknowledged. */
  public get allAreAcknowledged(): boolean {
    return this.changelogService.allAreAcknowledged;
  }

  /** Produces the app version. */
  public get appVersion(): string {
    return this.userSettingsService.appVersion;
  }

  constructor(
    private readonly userSettingsService: UserSettingsService,
    private readonly changelogService: ChangelogService,
    private readonly store: Store,
  ) {}

  /** True when the automatic popup is disabled. */
  public get disableAutomaticPopup(): boolean {
    return this.changelogService.disableAutomaticPopup;
  }

  /** Sets the state of automatic popup disabling. */
  public set disableAutomaticPopup(value: boolean) {
    this.changelogService.disableAutomaticPopup = value;
  }

  /** True if any panel is opened. */
  public get anyOpened(): boolean {
    return this.changelogs?.some(p => p.anyOpened) ?? true;
  }

  /** Closes all expandos. */
  public closeAll(): void {
    this.changelogs.forEach(changelog => changelog.closeAll());
  }

  /** Opens all expandos. */
  public openAll(): void {
    this.changelogs.forEach(changelog => changelog.openAll());
  }

  /** Resets the changelog state. */
  public resetAll(): void {
    this.store.dispatch(new ResetChangelog());
  }

  /** Acknowledges all changelog entries. */
  public acknowledgeAll(): void {
    this.store.dispatch(new AcknowledgeAllPendingChangelogUuids());
  }

  /** Marks all changelog entries as pending. */
  public markAllPending(): void {
    this.store.dispatch(new MarkAllChangelogUuidsAsPending());
  }
}
