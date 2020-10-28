import { Component, Input, OnChanges } from '@angular/core';

/** Retreives and displays related Sunrise accounts by XUID. */
@Component({
  selector: 'sunrise-gamertags',
  templateUrl: './gamertags.component.html',
  styleUrls: ['./gamertags.component.scss']
})
export class GamertagsComponent implements OnChanges {
  @Input() public xuid?: number;

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: any;

  public data: object[];

  constructor() { }

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (this.xuid === undefined) { return; }

    this.isLoading = true;
    this.loadError = undefined;
    this.sunrise.getBanHistoryByXuid(this.xuid)
      .subscribe(history => {
        this.isLoading = false;
        this.history = history;
        this.banList = this.history.servicesBanHistory.map(servicesBan => {
          const output: ServicesBanDescription & {correlatedBan: LiveOpsBanDescription} = _.clone(servicesBan) as any;
          output.correlatedBan = this.correlateLiveOps(servicesBan);
          return output;
        })
      },
      _error => {
        this.isLoading = false;
        this.loadError = _error; // TODO: Display something useful to the user
      });
  }
}
