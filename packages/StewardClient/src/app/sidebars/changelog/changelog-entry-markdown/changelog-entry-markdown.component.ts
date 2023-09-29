import { Component, Input } from '@angular/core';
import { MarkdownChangelogEntry } from '@environments/app-data/changelog';
import { ChangelogService } from '@services/changelog/changelog.service';
import { ChangelogEntryBaseComponent } from '../changelog-entry.base.component';
import { ThemeService } from '@shared/modules/theme/theme.service';
import { MermaidAPI } from 'ngx-markdown';

/** Renders an instance of {@see MarkdownChangelogEntry}. */
@Component({
  selector: 'changelog-entry-markdown',
  templateUrl: './changelog-entry-markdown.component.html',
  styleUrls: ['./changelog-entry-markdown.component.scss'],
})
export class ChangelogEntryMarkdownComponent extends ChangelogEntryBaseComponent<MarkdownChangelogEntry> {
  /** The entry to render. */
  @Input() public entry: MarkdownChangelogEntry;

  constructor(changelogService: ChangelogService, private readonly themeService: ThemeService) {
    super(changelogService);
  }

  /** A {@see MermaidAPI.Config} object for use with the markdown module. */
  public get mermaidOptions(): MermaidAPI.Config {
    return this.themeService.mermaidOptions;
  }
}
