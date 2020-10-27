import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { SunriseBanHistory } from '@models/sunrise/sunrise-ban-history.model';
import { SunriseService } from '@services/sunrise/sunrise.service';

/** Retreives and displays Sunrise Ban history by XUID. */
@Component({
  selector: 'sunrise-ban-history',
  templateUrl: './ban-history.component.html',
  styleUrls: ['./ban-history.component.scss']
})
export class BanHistoryComponent extends BaseComponent implements OnChanges {
  @Input() public xuid?: number;

  public data: object[];

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: any;
  /** This player's ban history. */
  public history: SunriseBanHistory;

  constructor(public readonly sunrise: SunriseService) {
    super();
  }

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (this.xuid === undefined) { return; }

    this.isLoading = true;
    this.loadError = undefined;
    this.sunrise.getBanHistoryByXuid(this.xuid)
      .subscribe(history => {
        this.isLoading = false;
        this.history = history;
      },
      _error => {
        this.isLoading = false;
        this.loadError = _error; // TODO: Display something useful to the user
      });
  }

}
