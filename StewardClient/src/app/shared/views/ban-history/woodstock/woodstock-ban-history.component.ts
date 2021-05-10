import BigNumber from 'bignumber.js';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { LiveOpsBanDescription } from '@models/woodstock';
import { WoodstockService } from '@services/woodstock/woodstock.service';

/** Retreives and displays Woodstock Ban history by XUID. */
@Component({
  selector: 'woodstock-ban-history',
  templateUrl: './woodstock-ban-history.component.html',
  styleUrls: ['./woodstock-ban-history.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class WoodstockBanHistoryComponent extends BaseComponent implements OnChanges {
  @Input() public xuid?: BigNumber;

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;

  /** The ban list to display. */
  public banList: LiveOpsBanDescription[];

  /** The columns + order to display. */
  public columnsToDisplay = ['isActive', 'reason', 'featureArea', 'startTimeUtc', 'expireTimeUtc'];

  constructor(private readonly woodstock: WoodstockService) {
    super();
  }

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (this.xuid === undefined) {
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;
    this.woodstock.getBanHistoryByXuid(this.xuid).subscribe(
      banHistory => {
        this.isLoading = false;
        this.banList = banHistory;
      },
      _error => {
        this.isLoading = false;
        this.loadError = _error; // TODO: Display something useful to the user
      },
    );
  }
}
