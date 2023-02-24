import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { LiveOpsBanDescription } from '@models/sunrise';
import { EMPTY } from 'rxjs';
import { catchError, take, takeUntil } from 'rxjs/operators';
import { LiveOpsExtendedBanDescription } from '@models/woodstock';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ForumBanHistoryService } from '@services/api-v2/all/player/forum-ban-history.service';

/** Extended type from LiveOpsExtendedBanDescription. */
type BanHistoryTableEntry = LiveOpsExtendedBanDescription & {
  monitor?: ActionMonitor;
};

/** Retreives and displays Forum Ban history by XUID. */
@Component({
  selector: 'forum-ban-history',
  templateUrl: './forum-ban-history.component.html',
  styleUrls: ['./forum-ban-history.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ForumBanHistoryComponent extends BaseComponent implements OnChanges {
  /** Player xuid. */
  @Input() public xuid?: BigNumber;

  /** True while waiting on a request. */
  public isLoading = true;

  /** The error received while loading. */
  public loadError: unknown;

  /** The ban list to display. */
  public banList: LiveOpsBanDescription[];

  /** The columns + order to display. */
  public columnsToDisplay = ['reason', 'featureArea', 'issuedTimeUtc'];

  constructor(private readonly forumBanHistoryService: ForumBanHistoryService) {
    super();
  }

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (!this.xuid) {
      this.banList = [];
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;

    const getBanHistoryByXuid$ = this.forumBanHistoryService.getBanHistoryByXuid$(this.xuid);
    getBanHistoryByXuid$
      .pipe(
        take(1),
        catchError(error => {
          this.isLoading = false;
          this.loadError = error;
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
}
