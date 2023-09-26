import { Component, Input } from '@angular/core';
import { OldChangelogEntry } from '@environments/app-data/changelog';
import { ChangelogService } from '@services/changelog/changelog.service';
import { ChangelogEntryBaseComponent } from '../changelog-entry.base.component';

/** Renders an instance of {@see OldChangelogEntry}. */
@Component({
  selector: 'changelog-entry-old',
  templateUrl: './changelog-entry-old.component.html',
  styleUrls: ['./changelog-entry-old.component.scss'],
})
export class ChangelogEntryOldComponent extends ChangelogEntryBaseComponent<OldChangelogEntry> {
  /** The entry to render. */
  @Input() public entry: OldChangelogEntry;

  constructor(changelogService: ChangelogService) {
    super(changelogService);
  }
}
