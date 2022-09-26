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
  type: 'tag target' | 'tag internal' | 'tag all' | 'tag general' | null;
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
  /** Changelog entry to be displayed. */
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
    this.tagOrToolChips = this.buildTagOrToolDetailChips();
    this.titleChips = this.buildTitleDetailChips();
  }

  private buildTagOrToolDetailChips(): ChanglogEntryChip[] {
    const entryAsArea = this.entry.tag as ChangelogArea;

    const hasToolDetails = !!entryAsArea?.tool;
    if (hasToolDetails) {
      const isMultiToolsChange = entryAsArea?.tool instanceof Array;
      const tools = isMultiToolsChange
        ? (entryAsArea.tool as NavbarTool[])
        : [entryAsArea.tool as NavbarTool];

      return tools.map(
        tool =>
          ({
            title: this.humanizePipe.transform(tool.split('-').join(' ')), // Navtool is a hyphen separate string
            type: 'tag target',
            tooltip: null,
          } as ChanglogEntryChip),
      );
    } else {
      let type = 'tag';
      let tooltip: string = null;
      switch (this.entry.tag as ChangelogTag) {
        case ChangelogTag.All:
          type = 'tag all';
          tooltip = 'This change affects everything'
          break;
        case ChangelogTag.General:
          type = 'tag general';
          tooltip = 'General changes may alter many tools'
          break;
        case ChangelogTag.Internal:
          type = 'tag internal';
          tooltip = 'Internal changes are largely development-related'
          break;
      }

      return [
        {
          title: this.humanizePipe.transform(this.entry.tag as ChangelogTag),
          type,
          tooltip,
        } as ChanglogEntryChip,
      ];
    }
  }

  private buildTitleDetailChips(): ChanglogEntryChip[] {
    const entryAsArea = this.entry.tag as ChangelogArea;

    const hasTitleDetails = !!entryAsArea?.title;
    if (hasTitleDetails) {
      const isAllTitleChange = entryAsArea?.title === 'all';
      if (isAllTitleChange) {
        return [
          {
            title: 'All Titles',
            tooltip: 'Changes to all titles changes the behavior of all supported title modes of the tool',
            type: 'tag target',
          }
        ];
      }

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

      const result = titles
        .filter(title => title !== GameTitle.Street)
        .map(
          title =>
            ({
              title: this.gameTitleAbbreviationPipe.transform(title),
              tooltip: this.gameTitleFullNamePipe.transform(title),
            } as ChanglogEntryChip),
        );

      return result;
    }
  }
}
