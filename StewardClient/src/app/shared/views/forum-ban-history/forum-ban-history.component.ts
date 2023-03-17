import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { LiveOpsBanDescription } from '@models/sunrise';
import { takeUntil } from 'rxjs/operators';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ForumBanHistoryService } from '@services/api-v2/forum/ban-history/forum-ban-history.service';

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

  /** The ban list to display. */
  public banList: LiveOpsBanDescription[];

  /** The columns + order to display. */
  public columnsToDisplay = ['reason', 'featureArea', 'issuedTimeUtc'];

  public getMonitor = new ActionMonitor('Get Forum Ban History');

  constructor(private readonly forumBanHistoryService: ForumBanHistoryService) {
    super();
  }

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (!this.xuid) {
      this.banList = [];
      return;
    }
    this.getMonitor = this.getMonitor.repeat();
    this.forumBanHistoryService
      .getBanHistoryByXuid$(this.xuid)
      .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(banHistory => {
        this.banList = banHistory;
      });
  }
}
