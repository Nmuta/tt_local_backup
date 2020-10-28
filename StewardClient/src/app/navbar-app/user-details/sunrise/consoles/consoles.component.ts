import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { faGavel } from '@fortawesome/free-solid-svg-icons';
import { SunriseConsoleDetails } from '@models/sunrise/sunrise-console-details.model';
import { SunriseService } from '@services/sunrise/sunrise.service';

/** Retreives and displays related Sunrise consoles by XUID. */
@Component({
  selector: 'sunrise-consoles',
  templateUrl: './consoles.component.html',
  styleUrls: ['./consoles.component.scss']
})
export class ConsolesComponent implements OnChanges {
  @Input() public xuid?: number;

  public bannedIcon = faGavel;

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: any;

  public consoleDetails: SunriseConsoleDetails;
  public columnsToDisplay = ['isBanned', 'consoleId', 'deviceType', 'actions'];

  constructor(private readonly sunrise: SunriseService) { }

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (this.xuid === undefined) { return; }

    this.isLoading = true;
    this.loadError = undefined;
    this.sunrise.getConsoleDetailsByXuid(this.xuid)
      .subscribe(consoleDetails => {
        this.isLoading = false;
        this.consoleDetails = consoleDetails;
      },
      _error => {
        this.isLoading = false;
        this.loadError = _error; // TODO: Display something useful to the user
      });
  }
}
