import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { LiveOpsBanDescription } from '@models/sunrise';
import { EMPTY, Observable } from 'rxjs';
import { catchError, take, takeUntil } from 'rxjs/operators';
import { GameTitle } from '@models/enums';
import { UnbanResult } from '@models/unban-result';
import { LiveOpsExtendedBanDescription } from '@models/woodstock';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { OldPermissionServiceTool, OldPermissionsService } from '@services/old-permissions';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { getUserDetailsRoute } from '@helpers/route-links';

/** Extended type from LiveOpsExtendedBanDescription. */
type BanHistoryTableEntry = LiveOpsExtendedBanDescription & {
  monitor?: ActionMonitor;
};

/** Retreives and displays Ban history by XUID. */
@Component({
  template: '',
})
export abstract class BanHistoryBaseComponent extends BaseComponent implements OnChanges {
  /** REVIEW-COMMENT: Player xuid. */
  @Input() public xuid?: BigNumber;

  /** True while waiting on a request. */
  public isLoading = true;

  /** The error received while loading. */
  public loadError: unknown;

  /** The ban list to display. */
  public banList: LiveOpsBanDescription[];

  /** Disable actions. */
  public allowActions: boolean;

  /** The columns + order to display. */
  public columnsToDisplay: string[];

  /** Columns to always display. */
  private baseColumns = ['state', 'reason', 'banDetails', 'startTimeUtc', 'expireTimeUtc'];

  public generalRouterLink = getUserDetailsRoute('general');

  public actionsEnabled: boolean = false;

  public readonly permAttribute = PermAttributeName.DeleteBan;

  public abstract gameTitle: GameTitle;

  constructor(private readonly permissionsService: OldPermissionsService) {
    super();
  }

  public abstract getBanHistoryByXuid$(xuid: BigNumber): Observable<LiveOpsBanDescription[]>;
  public abstract expireBan$(banEntryId: BigNumber): Observable<UnbanResult>;
  public abstract deleteBan$(banEntryId: BigNumber): Observable<UnbanResult>;

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (!this.xuid) {
      this.banList = [];
      return;
    }

    this.allowActions = this.permissionsService.currentUserHasWritePermission(
      OldPermissionServiceTool.Unban,
    );

    if (this.actionsEnabled) {
      this.columnsToDisplay = this.baseColumns.concat('actions');
    } else {
      this.columnsToDisplay = this.baseColumns;
    }

    this.isLoading = true;
    this.loadError = undefined;

    const getBanHistoryByXuid$ = this.getBanHistoryByXuid$(this.xuid);
    getBanHistoryByXuid$
      .pipe(
        take(1),
        catchError(error => {
          this.isLoading = false;
          this.loadError = error; // TODO: Display something useful to the user
          return EMPTY;
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(banHistory => {
        const banHistoryTableEntries: BanHistoryTableEntry[] = banHistory;
        banHistoryTableEntries.forEach(
          entry =>
            (entry.monitor = new ActionMonitor(`Post Updating ban with ID: ${entry?.banEntryId}`)),
        );
        this.isLoading = false;
        this.banList = banHistory;
      });
  }

  /** Edit item quantity */
  public expireEntry(entry: BanHistoryTableEntry): void {
    entry.monitor = entry?.monitor.repeat();
    this.expireBan$(entry?.banEntryId)
      .pipe(entry.monitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        entry.isActive = false;
      });
  }

  /** Edit item quantity */
  public deleteEntry(entry: BanHistoryTableEntry): void {
    entry.monitor = entry?.monitor.repeat();
    this.deleteBan$(entry?.banEntryId)
      .pipe(entry.monitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        entry.isActive = false;
        entry.isDeleted = true;
      });
  }
}
