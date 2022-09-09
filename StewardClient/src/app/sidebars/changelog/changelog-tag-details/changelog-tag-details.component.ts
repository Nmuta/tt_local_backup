import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { ChangelogArea, ChangelogEntry, ChangelogTag } from '@environments/app-data/changelog';
import { NavbarTool } from '@environments/environment';
import { GameTitle } from '@models/enums';
import { GameTitleAbbreviationPipe } from '@shared/pipes/game-title-abbreviation.pipe';
import { GameTitleFullNamePipe } from '@shared/pipes/game-title-full-name.pipe';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';

interface ChanglogEntryChip {
  title: string;
  tooltip: string;
}

/** Displays a single changelog group. */
@Component({
  selector: 'changelog-tag-details',
  templateUrl: './changelog-tag-details.component.html',
  styleUrls: ['./changelog-tag-details.component.scss'],
  providers: [GameTitleAbbreviationPipe, GameTitleFullNamePipe, HumanizePipe],
})
export class ChangelogTagDetailsComponent extends BaseComponent implements OnChanges {
  @Input() public entry: ChangelogEntry;

  public tagOrToolChips: ChanglogEntryChip[] = [];
  public titleChips: ChanglogEntryChip[] = [];

  constructor(
    private readonly gameTitleAbbreviationPipe: GameTitleAbbreviationPipe,
    private readonly gameTitleFullNamePipe: GameTitleFullNamePipe,
    private readonly humanizePipe: HumanizePipe,
  ) {
    super();
  }

  /** Lifecycle hook */
  public ngOnChanges(): void {
    const entryAsArea = this.entry.tag as ChangelogArea;
    this.titleChips = [];
    this.tagOrToolChips = [];

    const hasToolDetails = !!entryAsArea?.tool;
    if (hasToolDetails) {
      const isMultiToolsChange = entryAsArea?.tool instanceof Array;
      const tools = isMultiToolsChange
        ? (entryAsArea.tool as NavbarTool[])
        : [entryAsArea.tool as NavbarTool];

      this.tagOrToolChips = tools.map(
        tool =>
          ({
            title: this.humanizePipe.transform(tool.split('-').join(' ')), // Navtool is a hyphen separate string
            tooltip: null,
          } as ChanglogEntryChip),
      );
    } else {
      this.tagOrToolChips = [
        {
          title: this.humanizePipe.transform(this.entry.tag as ChangelogTag),
          tooltip: null,
        } as ChanglogEntryChip,
      ];
    }

    const hasTitleDetails = !!entryAsArea?.title;
    if (hasTitleDetails) {
      const isMultiTitleChange =
        entryAsArea?.title === 'all' || entryAsArea?.title instanceof Array;
      let titles: GameTitle[] = [];

      if (isMultiTitleChange) {
        titles =
          entryAsArea?.title === 'all'
            ? Object.keys(GameTitle).map(key => GameTitle[key])
            : (entryAsArea?.title as GameTitle[]);
      } else {
        titles = [entryAsArea?.title as GameTitle];
      }

      this.titleChips = titles
        .filter(title => title !== GameTitle.Street)
        .map(
          title =>
            ({
              title: this.gameTitleAbbreviationPipe.transform(title),
              tooltip: this.gameTitleFullNamePipe.transform(title),
            } as ChanglogEntryChip),
        );
    }
  }
}
