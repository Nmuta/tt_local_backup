import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges } from '@angular/core';
import { WoodstockProfileSummary } from '@models/woodstock';
import { WoodstockService } from '@services/woodstock/woodstock.service';

/** Retrieves and displays Woodstock Overview by XUID. */
@Component({
  selector: 'woodstock-overview',
  templateUrl: './woodstock-overview.component.html',
  styleUrls: ['./woodstock-overview.component.scss'],
})
export class WoodstockOverviewComponent implements OnChanges {
  @Input() public xuid?: BigNumber;

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;
  /** The overview data. */
  public profileSummary: WoodstockProfileSummary;

  constructor(private readonly woodstock: WoodstockService) {}

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (this.xuid === undefined) {
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;
    this.woodstock.getProfileSummaryByXuid(this.xuid).subscribe(
      summary => {
        this.isLoading = false;
        this.profileSummary = summary;
      },
      _error => {
        this.isLoading = false;
        this.loadError = _error; // TODO: Display something useful to the user
      },
    );
  }
}
