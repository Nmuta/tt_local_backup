import { AfterViewInit, Component, Input, ViewChild, ViewChildren } from '@angular/core';
import { MatLegacyCheckboxChange as MatCheckboxChange } from '@angular/material/legacy-checkbox';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { BaseComponent } from '@components/base-component/base.component';
import {
  ChangelogEntry,
  ChangelogGroup,
  ChangelogTag,
  MarkdownChangelogEntry,
  OldChangelogEntry,
} from '@environments/app-data/changelog';
import { renderDelay } from '@helpers/rxjs';
import { Select } from '@ngxs/store';
import { ChangelogService } from '@services/changelog/changelog.service';
import { ChangelogModel } from '@shared/state/changelog/changelog.model';
import { ChangelogState } from '@shared/state/changelog/changelog.state';
import { Observable, takeUntil } from 'rxjs';
import { has } from 'lodash';

/** Displays a single changelog group. */
@Component({
  selector: 'changelog-group',
  templateUrl: './changelog-group.component.html',
  styleUrls: ['./changelog-group.component.scss'],
})
export class ChangelogGroupComponent extends BaseComponent implements AfterViewInit {
  @Select(ChangelogState) public changelogState$: Observable<ChangelogModel>;
  /** Changelog group to be displayed. */
  @Input() public group: ChangelogGroup;
  @ViewChild(MatAccordion) public accordion: MatAccordion;
  @ViewChildren(MatExpansionPanel) public panels: MatExpansionPanel[];

  public groupIsComplete = false;
  public groupIsIndeterminate = false;

  public readonly ChangelogTag = ChangelogTag;

  constructor(private readonly changelogService: ChangelogService) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngAfterViewInit(): void {
    this.changelogService.changed$
      .pipe(renderDelay(), takeUntil(this.onDestroy$))
      .subscribe(() => this.syncGroupState());
  }

  /** True when given entry is a {@see MarkdownChangelogEntry}. */
  public isMarkdownEntry(entry: ChangelogEntry): entry is MarkdownChangelogEntry {
    return has(entry, 'shortMarkdown');
  }

  /** True when given entry is an {@see OldChangelogEntry}. */
  public isOldEntry(entry: ChangelogEntry): entry is OldChangelogEntry {
    return has(entry, 'shortText');
  }

  /** Casts a changelog entry to a {@see MarkdownChangelogEntry} if safe. Otherwise throws. */
  public toMarkdownEntry(entry: ChangelogEntry): MarkdownChangelogEntry {
    if (!this.isMarkdownEntry(entry)) {
      throw new Error('Given entry is not a markdown changelog entry.');
    }

    return entry as MarkdownChangelogEntry;
  }

  /** Casts a changelog entry to a {@see OldChangelogEntry} if safe. Otherwise throws. */
  public toOldEntry(entry: ChangelogEntry): OldChangelogEntry {
    if (!this.isOldEntry(entry)) {
      throw new Error('Given entry is not an old-style changelog entry.');
    }

    return entry as OldChangelogEntry;
  }

  /** True if the uuid is acknowledged. */
  public isAcknowledgedEntry(changelogEntry: ChangelogEntry): boolean {
    const acked = this.changelogService.isAcknowledged(changelogEntry.uuid);
    return acked;
  }

  /** True if the uuid is pending. */
  public isPendingEntry(changelogEntry: ChangelogEntry): boolean {
    return this.changelogService.isPending(changelogEntry.uuid);
  }

  /** True if the uuid is unknown. */
  public isIndeterminateEntry(changelogEntry: ChangelogEntry): boolean {
    return this.changelogService.isIndeterminate(changelogEntry.uuid);
  }

  /** Acknowledge the given entry. */
  public acknowledgeEntry(changelogEntry: ChangelogEntry): void {
    this.changelogService.acknowledge(changelogEntry.uuid);
  }

  /** Mark the given entry as pending. */
  public markEntryPending(changelogEntry: ChangelogEntry): void {
    this.changelogService.markPending(changelogEntry.uuid);
  }

  /** Toggles the acknowledgement state of a given entry. */
  public updateEntry(changelogEntry: ChangelogEntry, $event: MatCheckboxChange): void {
    if ($event.checked) {
      this.acknowledgeEntry(changelogEntry);
    } else {
      this.markEntryPending(changelogEntry);
    }
  }

  /** Toggles the acknowledgement state of the entire group. */
  public updateGroup(checked: boolean): void {
    if (checked) {
      this.changelogService.acknowledge(this.group.entries.map(e => e.uuid));
    } else {
      this.changelogService.markPending(this.group.entries.map(e => e.uuid));
    }
  }

  /** True if any panel is opened. */
  public get anyOpened(): boolean {
    return this.panels?.some(p => p.expanded) ?? true;
  }

  /** Closes all expandos in this section. */
  public closeAll(): void {
    this.accordion.closeAll();
  }

  /** Opens all expandos in this section. */
  public openAll(): void {
    this.accordion.openAll();
  }

  private syncGroupState(): void {
    const allAcknowledged = this.group.entries.every(entry => this.isAcknowledgedEntry(entry));
    const allPending = this.group.entries.every(entry => this.isPendingEntry(entry));
    const anyIndeterminate = this.group.entries.some(entry => this.isIndeterminateEntry(entry));
    this.groupIsComplete = allAcknowledged;
    this.groupIsIndeterminate = anyIndeterminate || (!allAcknowledged && !allPending);
  }
}
