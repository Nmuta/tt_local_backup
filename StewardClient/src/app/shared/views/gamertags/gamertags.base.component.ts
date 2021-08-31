import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { BaseComponent } from '@components/base-component/base.component';
import { catchError, takeUntil } from 'rxjs/operators';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultUnion } from '@models/identity-query.model';
import { NavbarTools } from '@navbar-app/navbar-tool-list';
import { ActivatedRoute } from '@angular/router';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { getToolsActivatedRoute } from '@helpers/tools-activated-route';

/** Base component for related gamertags. */
@Component({
  template: '',
})
export abstract class GamertagsBaseComponent<T> extends BaseComponent implements OnInit, OnChanges {
  @Input() public identity?: IdentityResultUnion;

  /** The retrieved list of shared users. */
  public sharedConsoleUsers: T[];
  public columnsToDisplay = ['everBanned', 'gamertag', 'sharedConsoleId', 'xuid'];

  /** The user details route. */
  public userDetailsRouterLink: string[];
  public toolsRoute: ActivatedRoute;

  /** Monitor to manage GET gamertags request. */
  public getMonitor = new ActionMonitor('Get gamertags monitor');

  public abstract gameTitle: GameTitleCodeName;

  constructor(private readonly route: ActivatedRoute) {
    super();
  }

  /** Gets the shared console gamertag list. */
  public abstract getSharedConsoleUsersByXuid$(xuid: BigNumber): Observable<T[]>;

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.userDetailsRouterLink = [
      `./${NavbarTools.UserDetailsPage.path}`,
      this.gameTitle.toLowerCase(),
    ];

    this.toolsRoute = getToolsActivatedRoute(this.route);
  }

  /** Lifecycle hook. */
  public ngOnChanges(): void {
    if (!this.identity?.xuid) {
      return;
    }

    this.getMonitor = new ActionMonitor(this.getMonitor.dispose().label);
    const getSharedConsoleUsersByXuid$ = this.getSharedConsoleUsersByXuid$(this.identity.xuid);
    getSharedConsoleUsersByXuid$
      .pipe(
        this.getMonitor.monitorSingleFire(),
        catchError(_error => EMPTY),
        takeUntil(this.onDestroy$),
      )
      .subscribe(sharedConsoleUsers => {
        this.sharedConsoleUsers = sharedConsoleUsers;
      });
  }
}
