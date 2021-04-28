import BigNumber from 'bignumber.js';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { faCheck, faHistory } from '@fortawesome/free-solid-svg-icons';
import { SteelheadBanHistoryEntry } from '@models/steelhead';
import { SteelheadService } from '@services/steelhead/steelhead.service';

/** Retreives and displays Steelhead Ban history by XUID. */
@Component({
  selector: 'steelhead-ban-history',
  templateUrl: './steelhead-ban-history.component.html',
  styleUrls: ['./steelhead-ban-history.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SteelheadBanHistoryComponent extends BaseComponent implements OnChanges {
  @Input() public xuid?: BigNumber;

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;

  /** The ban list to display. */
  public banList: SteelheadBanHistoryEntry[];

  public isActiveIcon = faCheck;
  public isInactiveIcon = faHistory;

  /** The columns + order to display. */
  public columnsToDisplay = ['isActive', 'reason', 'featureArea', 'startTimeUtc', 'expireTimeUtc'];

  constructor(private readonly steelhead: SteelheadService) {
    super();
  }

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (this.xuid === undefined) {
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;
    this.steelhead.getBanHistoryByXuid(this.xuid).subscribe(
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
