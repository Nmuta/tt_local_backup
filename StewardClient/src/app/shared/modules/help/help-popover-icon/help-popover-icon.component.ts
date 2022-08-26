import { Component, Input, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { takeUntil } from 'rxjs/operators';
import { filter } from 'rxjs';

/** Produces a questionmark icon which contains helpful text and an optional link to the docs. */
@Component({
  selector: 'help-popover-icon',
  templateUrl: './help-popover-icon.component.html',
  styleUrls: ['./help-popover-icon.component.scss'],
})
export class HelpPopoverIconComponent extends BaseComponent implements OnInit {
  @Input() public cardTitle: string = '';
  @Input() public cardSubtitle: string = 'Help card';
  @Input() public confluenceName: string = '';

  public isOpen = false;

  constructor(private readonly router: Router) {
    super();
  }

  /** Life-cycle hook. */
  public ngOnInit(): void {
    // https://stackoverflow.com/questions/51821766/angular-material-dialog-not-closing-after-navigation
    // TODO: https://dev.azure.com/t10motorsport/Motorsport/_workitems/edit/1293600
    this.router.events
      .pipe(
        filter(x => x instanceof NavigationStart),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => (this.isOpen = false));
  }

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

  /** Closes the help popover. */
  public closePopup(): void {
    this.isOpen = false;
  }
}
