import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { SunriseProfileSummary } from '@models/sunrise/sunrise-profile-summary.model';
import { SunriseService } from '@services/sunrise/sunrise.service';

/** Retrieves and displays Sunrise Overview by XUID. */
@Component({
  selector: 'sunrise-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnChanges {
  @Input() public xuid?: number;

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: any;
  /** The overview data. */
  public profileSummary: SunriseProfileSummary;

  constructor(private readonly sunrise: SunriseService) {}

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (this.xuid === undefined) {
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;
    this.sunrise.getProfileSummaryByXuid(this.xuid).subscribe(
      summary => {
        this.isLoading = false;
        this.profileSummary = summary;
      },
      _error => {
        this.isLoading = false;
        this.loadError = _error; // TODO: Display something useful to the user
      }
    );
  }
}
