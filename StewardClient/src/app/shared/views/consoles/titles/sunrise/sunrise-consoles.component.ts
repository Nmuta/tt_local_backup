import { Component, Input, OnChanges } from '@angular/core';
import { faGavel } from '@fortawesome/free-solid-svg-icons';
import { SunriseConsoleDetails } from '@models/sunrise/sunrise-console-details.model';
import { SunriseService } from '@services/sunrise/sunrise.service';
import _ from 'lodash';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/** Retreives and displays related Sunrise consoles by XUID. */
@Component({
  selector: 'sunrise-consoles',
  templateUrl: './sunrise-consoles.component.html',
  styleUrls: ['./sunrise-consoles.component.scss'],
})
export class SunriseConsolesComponent implements OnChanges {
  @Input() public xuid?: number;

  public bannedIcon = faGavel;

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;

  public consoleDetails: SunriseConsoleDetails;
  public columnsToDisplay = ['isBanned', 'consoleId', 'deviceType', 'actions'];

  constructor(private readonly sunrise: SunriseService) {}

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (!this.xuid) {
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;
    this.sunrise.getConsoleDetailsByXuid(this.xuid).subscribe(
      consoleDetails => {
        this.isLoading = false;
        this.consoleDetails = consoleDetails;
      },
      _error => {
        this.isLoading = false;
        this.loadError = _error; // TODO: Display something useful to the user
      },
    );
  }

  /** Generates a function that will *ban* the user and update the data when complete. */
  public makeBanAction(consoleId: string): () => Observable<void> {
    return () =>
      this.sunrise.putBanStatusByConsoleId(consoleId, true).pipe(
        tap(() => {
          _(this.consoleDetails)
            .filter(d => d.consoleId === consoleId)
            .first().isBanned = true;
        }),
      );
  }

  /** Generates a function that will *unban* the user and update data when complete. */
  public makeUnbanAction(consoleId: string): () => Observable<void> {
    return () =>
      this.sunrise.putBanStatusByConsoleId(consoleId, false).pipe(
        tap(() => {
          _(this.consoleDetails)
            .filter(d => d.consoleId === consoleId)
            .first().isBanned = false;
        }),
      );
  }
}
