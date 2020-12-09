import { Component, Input, OnChanges } from '@angular/core';
import { SunriseCreditHistory } from '@models/sunrise/sunrise-credit-history.model';
import { SunriseService } from '@services/sunrise/sunrise.service';

/** Retreives and displays Sunrise credit history by XUID. */
@Component({
  selector: 'sunrise-credit-history',
  templateUrl: './sunrise-credit-history.component.html',
  styleUrls: ['./sunrise-credit-history.component.scss'],
})
export class SunriseCreditHistoryComponent implements OnChanges {
  @Input() public xuid?: number;

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;
  /** The credit history data. */
  public creditHistory: SunriseCreditHistory;
  public columnsToDisplay = [
    'eventTimestampUtc',
    'deviceType',
    'creditsAfter',
    'creditAmount',
    'sceneName',
    'totalXp',
  ];

  constructor(private readonly sunrise: SunriseService) {}

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (this.xuid === undefined) {
      return;
    }

    // TODO: This only grabs the first page of results. Something more complete should probably be its own PR after discussion.
    this.isLoading = true;
    this.loadError = undefined;
    this.sunrise.getCreditHistoryByXuid(this.xuid).subscribe(
      creditHistory => {
        this.isLoading = false;
        this.creditHistory = creditHistory;
      },
      _error => {
        this.isLoading = false;
        this.loadError = _error; // TODO: Display something useful to the user
      },
    );
  }
}
