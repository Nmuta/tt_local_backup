import { Component, Input } from '@angular/core';

/** Produces a questionmark icon which contains helpful text and an optional link to the docs. */
@Component({
  selector: 'help-popover-icon',
  templateUrl: './help-popover-icon.component.html',
  styleUrls: ['./help-popover-icon.component.scss'],
})
export class HelpPopoverIconComponent {
  @Input() public cardTitle: string = '';
  @Input() public cardSubtitle: string = 'Help card';
  @Input() public confluenceName: string = '';

  /** The link to the page for this tooltip. */
  public get confluenceLink(): string {
    return this.confluenceName
      ? `https://confluence.turn10studios.com/pages/createpage.action?spaceKey=T10&title=${this.confluenceName}&linkCreation=true&fromPageId=73760861`
      : undefined;
  }

  /** The tooltip to display. */
  public get tooltip(): string {
    return this.confluenceName
      ? 'Click to view help card and confluence link'
      : 'Click to view help card';
  }

  public isOpen = false;
}
