import { Component, Input } from '@angular/core';
import { MatLegacyCheckboxChange } from '@angular/material/legacy-checkbox';
import { BaseComponent } from '@components/base-component/base.component';
import { ChangelogEntry } from '@environments/app-data/changelog';
import { ChangelogService } from '@services/changelog/changelog.service';

/** Renders an instance of {@see OldChangelogEntry}. */
@Component({ template: '' })
export class ChangelogEntryBaseComponent<TChangelog extends ChangelogEntry> extends BaseComponent {
  /** The entry to render. */
  @Input() public entry: TChangelog;

  constructor(private readonly changelogService: ChangelogService) {
    super();
  }

  /** True if the uuid is acknowledged. */
  public isAcknowledgedEntry(changelogEntry: TChangelog): boolean {
    const acked = this.changelogService.isAcknowledged(changelogEntry.uuid);
    return acked;
  }

  /** True if the uuid is pending. */
  public isPendingEntry(changelogEntry: TChangelog): boolean {
    return this.changelogService.isPending(changelogEntry.uuid);
  }

  /** True if the uuid is unknown. */
  public isIndeterminateEntry(changelogEntry: TChangelog): boolean {
    return this.changelogService.isIndeterminate(changelogEntry.uuid);
  }

  /** Acknowledge the given entry. */
  public acknowledgeEntry(changelogEntry: TChangelog): void {
    this.changelogService.acknowledge(changelogEntry.uuid);
  }

  /** Mark the given entry as pending. */
  public markEntryPending(changelogEntry: TChangelog): void {
    this.changelogService.markPending(changelogEntry.uuid);
  }

  /** Toggles the acknowledgement state of a given entry. */
  public updateEntry(changelogEntry: TChangelog, $event: MatLegacyCheckboxChange): void {
    if ($event.checked) {
      this.acknowledgeEntry(changelogEntry);
    } else {
      this.markEntryPending(changelogEntry);
    }
  }
}
