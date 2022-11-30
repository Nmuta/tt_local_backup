import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { IdentityResultUnion } from '@models/identity-query.model';
import { EMPTY, Observable } from 'rxjs';
import { catchError, take, takeUntil } from 'rxjs/operators';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { SteelheadConsoleDetailsEntry } from '@models/steelhead';
import { ApolloConsoleDetailsEntry } from '@models/apollo';
import { WoodstockConsoleDetailsEntry } from '@models/woodstock';
import { SunriseConsoleDetailsEntry } from '@models/sunrise';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { PermissionServiceTool, OldPermissionsService } from '@services/old-permissions';

type ConsoleActionMonitors = {
  banActionMonitor: ActionMonitor;
  unbanActionMonitor: ActionMonitor;
};

type ConsoleDetailsTitleInterspection = SteelheadConsoleDetailsEntry &
  ApolloConsoleDetailsEntry &
  WoodstockConsoleDetailsEntry &
  SunriseConsoleDetailsEntry;

/** Retreives and displays related Sunrise consoles by XUID. */
@Component({
  template: '',
})
export abstract class ConsolesBaseComponent<T extends ConsoleDetailsTitleInterspection>
  extends BaseComponent
  implements OnChanges
{
  /** REVIEW-COMMENT: Player identity. */
  @Input() public identity?: IdentityResultUnion;
  /** REVIEW-COMMENT: If input is disabled. */
  @Input() public disabled: boolean = false;

  public consoleDetails = new BetterMatTableDataSource<T & ConsoleActionMonitors>();
  public columnsToDisplay = ['isBanned', 'consoleId', 'deviceType', 'actions'];
  public getConsoles = new ActionMonitor('Get consoles');

  public abstract gameTitle: GameTitle;
  public abstract supportsConsoleBanning: boolean;

  constructor(private readonly permissionsService: OldPermissionsService) {
    super();
  }

  /** Gets the console details list from XUID. */
  public abstract getConsoleDetailsByXuid$(xuid: BigNumber): Observable<T[]>;

  /** The ban action. */
  public abstract makeBanAction$(consoleId: string): Observable<void>;

  /** The unban action. */
  public abstract makeUnbanAction$(console: string): Observable<void>;

  /** Lifecycle hook. */
  public ngOnChanges(): void {
    if (!this.identity?.xuid) {
      return;
    }

    // Ignore permission service if disabled input is set to true
    this.disabled =
      this.disabled ||
      !this.permissionsService.currentUserHasWritePermission(PermissionServiceTool.ConsoleBan);

    this.getConsoles = this.getConsoles.repeat();
    const getConsoleDetailsByXuid$ = this.getConsoleDetailsByXuid$(this.identity.xuid);
    getConsoleDetailsByXuid$
      .pipe(
        take(1),
        this.getConsoles.monitorSingleFire(),
        catchError(() => EMPTY),
        takeUntil(this.onDestroy$),
      )
      .subscribe(consoleDetails => {
        this.consoleDetails.data = consoleDetails.map(console => {
          return {
            ...console,
            banActionMonitor: new ActionMonitor(`Ban console: ${console.consoleId}`),
            unbanActionMonitor: new ActionMonitor(`Unan console: ${console.consoleId}`),
          } as T & ConsoleActionMonitors;
        });
      });
  }

  /** Runs the ban action logic */
  public banAction(entry: T & ConsoleActionMonitors): void {
    const banAction$ = this.makeBanAction$(entry.consoleId);

    entry.banActionMonitor = entry.banActionMonitor.repeat();
    banAction$
      .pipe(entry.banActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe();
  }

  /** Runs the unban action logic */
  public unbanAction(entry: T & ConsoleActionMonitors): void {
    const unbanAction$ = this.makeUnbanAction$(entry.consoleId);

    entry.unbanActionMonitor = entry.unbanActionMonitor.repeat();
    unbanAction$
      .pipe(entry.unbanActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe();
  }
}
