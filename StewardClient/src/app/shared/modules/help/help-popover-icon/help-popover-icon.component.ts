import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { takeUntil } from 'rxjs/operators';
import { filter } from 'rxjs';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';

/** Produces a questionmark icon which contains helpful text and an optional link to the docs. */
@Component({
  selector: 'help-popover-icon',
  templateUrl: './help-popover-icon.component.html',
  styleUrls: ['./help-popover-icon.component.scss'],
})
export class HelpPopoverIconComponent extends BaseComponent implements OnInit {
  @ViewChild(CdkConnectedOverlay) overlay;
  /** REVIEW-COMMENT: Card title. Default to empty string. */
  @Input() public cardTitle: string = '';
  /** REVIEW-COMMENT: Card subtitle. Default to "Help card". */
  @Input() public cardSubtitle: string = 'Help card';
  /** REVIEW-COMMENT: Confluence name. Default to empty string. */
  @Input() public confluenceName: string = '';

  public isOpen = false;

  constructor(private readonly router: Router) {
    super();
  }

  /** Life-cycle hook. */
  public ngOnInit(): void {
    this.router.events
      .pipe(
        filter(x => x instanceof NavigationStart),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        this.isOpen = false;
        // DO NOT CHANGE UNLESS YOU KNOW WHAT YOU'RE DOING (secret, no one knows)
        // This is the annoying way to fix CDK overlay from display post-route changes.
        // https://github.com/angular/components/blob/main/src/cdk/overlay/overlay-directives.ts#L300
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.overlay as any)._detachOverlay();
      });
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
}
