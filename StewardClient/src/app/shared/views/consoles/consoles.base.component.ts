import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { faGavel } from '@fortawesome/free-solid-svg-icons';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultUnion } from '@models/identity-query.model';
import { EMPTY, Observable } from 'rxjs';
import { catchError, take, takeUntil } from 'rxjs/operators';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { PermissionServiceTool, PermissionsService } from '@services/permissions';

/** Retreives and displays related Sunrise consoles by XUID. */
@Component({
  template: '',
})
export abstract class ConsolesBaseComponent<T> extends BaseComponent implements OnChanges {
  @Input() public identity?: IdentityResultUnion;
  @Input() public disabled: boolean = false;

  public consoleDetails: T[];
  public columnsToDisplay = ['isBanned', 'consoleId', 'deviceType', 'actions'];
  public getConsoles = new ActionMonitor('Get consoles');

  public bannedIcon = faGavel;

  public abstract gameTitle: GameTitleCodeName;
  public abstract supportsConsoleBanning: boolean;

  constructor(private readonly permissionsService: PermissionsService) {
    super();
  }

  /** Gets the console details list from XUID. */
  public abstract getConsoleDetailsByXuid$(xuid: BigNumber): Observable<T[]>;

  /** Creates the action for the ban verify checkbox. */
  public abstract makeBanAction$(..._params: unknown[]): () => Observable<void>;

  /** Creates the action for the unban verify checkbox. */
  public abstract makeUnbanAction$(..._params: unknown[]): () => Observable<void>;

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
        this.consoleDetails = consoleDetails;
      });
  }
}
