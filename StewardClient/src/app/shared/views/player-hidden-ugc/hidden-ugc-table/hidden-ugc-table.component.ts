import { Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { GuidLikeString } from '@models/extended-types';
import { HideableUgc, HideableUgcFileType } from '@models/hideable-ugc.model';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { PermissionServiceTool, PermissionsService } from '@services/permissions';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import BigNumber from 'bignumber.js';
import { pull } from 'lodash';
import { Observable, takeUntil, timer } from 'rxjs';

export interface HiddenUgcServiceContract {
  unhideUgc$(
    xuid: BigNumber,
    fileType: HideableUgcFileType,
    ugcId: GuidLikeString,
  ): Observable<void>;
  getPlayerHiddenUGCByXuid$(xuid: BigNumber): Observable<HideableUgc[]>;
}

/** Extended type from HideableUgc. */
type HideableUgcTableEntries = HideableUgc & {
  monitor?: ActionMonitor;
};

/** Renders a player's hidden UGC. */
@Component({
  selector: 'hidden-ugc-table',
  templateUrl: './hidden-ugc-table.component.html',
  styleUrls: ['./hidden-ugc-table.component.scss'],
})
export class HiddenUgcTableComponent extends BaseComponent implements OnChanges, OnInit {
  @Input() public service: HiddenUgcServiceContract;
  @Input() public identity: IdentityResultAlpha;
  @Output() public reloadMonitor = new EventEmitter<ActionMonitor>();

  public displayedColumns = ['preview', 'info', 'times', 'actions'];
  public dataSource: BetterMatTableDataSource<HideableUgcTableEntries> =
    new BetterMatTableDataSource<HideableUgc>();

  public getMonitor = new ActionMonitor('GET Hidden UGC');
  public allMonitors: ActionMonitor[] = [this.getMonitor];

  public disableUnhide: boolean;

  constructor(private readonly permissionsService: PermissionsService) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    if (!this.service) {
      throw new Error('No service defined for Hidden UGC Table component.');
    }

    this.reloadMonitor.emit(this.getMonitor);
    this.disableUnhide = !this.permissionsService.currentUserHasWritePermission(
      PermissionServiceTool.UnhideUgc,
    );
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(): void {
    if (!this.identity.xuid) {
      this.dataSource.data = [];
      return;
    }

    this.refreshTable();
  }

  /** Type safety for UGC in the template. */
  public ugc(source: unknown): HideableUgc {
    return source as HideableUgc;
  }

  /** Refresh table data. */
  public refreshTable(): void {
    this.getMonitor = this.getMonitor.repeat();

    this.service
      .getPlayerHiddenUGCByXuid$(this.identity.xuid)
      .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(hiddenUgc => {
        const ugcItemsToProcess: HideableUgcTableEntries[] = hiddenUgc;
        ugcItemsToProcess.forEach(item => {
          item.monitor = new ActionMonitor(`POST Unhide UGC with ID: ${item.ugcId}`);
          this.allMonitors.push(item.monitor);
        });

        this.dataSource.data = ugcItemsToProcess;
      });
  }

  /** Unhide UGC item. */
  public unhideUGCItem(item: HideableUgcTableEntries): void {
    item.monitor = item.monitor.repeat();

    this.service
      .unhideUgc$(this.identity.xuid, item.fileType, item.ugcId)
      .pipe(item.monitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.deleteEntry(item);
      });
  }

  private deleteEntry(item: HideableUgcTableEntries): void {
    // Wait for monitor snackbar to fire before removing entry and disposing monitor
    timer(0)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        pull(this.dataSource.data, item);
        pull(this.allMonitors, item.monitor);
        item.monitor.dispose();

        this.dataSource._updateChangeSubscription();
      });
  }
}
