import { Component, Input, OnChanges } from '@angular/core';
import { faGavel } from '@fortawesome/free-solid-svg-icons';
import { SunriseSharedConsoleUsers } from '@models/sunrise/sunrise-shared-console-users.model';
import { SunriseService } from '@services/sunrise/sunrise.service';

/** Retreives and displays related Sunrise accounts by XUID. */
@Component({
  selector: 'sunrise-gamertags',
  templateUrl: './gamertags.component.html',
  styleUrls: ['./gamertags.component.scss']
})
export class GamertagsComponent implements OnChanges {
  @Input() public xuid?: number;

  public everBannedIcon = faGavel;

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: any;
  /** The retrieved list of shared users. */
  public sharedConsoleUsers: SunriseSharedConsoleUsers;
  public columnsToDisplay = ['everBanned', 'gamertag', 'sharedConsoleId', 'xuid'];

  constructor(private readonly sunrise: SunriseService) { }

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (this.xuid === undefined) { return; }

    this.isLoading = true;
    this.loadError = undefined;
    this.sunrise.getSharedConsoleUsersByXuid(this.xuid)
      .subscribe(sharedConsoleUsers => {
        this.isLoading = false;
        this.sharedConsoleUsers = sharedConsoleUsers;
      },
      _error => {
        this.isLoading = false;
        this.loadError = _error; // TODO: Display something useful to the user
      });
  }
}
