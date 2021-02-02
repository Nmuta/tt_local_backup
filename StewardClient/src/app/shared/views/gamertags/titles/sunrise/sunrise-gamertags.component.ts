import { Component, Input, OnChanges } from '@angular/core';
import { faGavel } from '@fortawesome/free-solid-svg-icons';
import { SunriseSharedConsoleUsers } from '@models/sunrise/sunrise-shared-console-users.model';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { createNavbarPath, NavbarTools } from 'app/pages/navbar-app/navbar-tool-list';

/** Retreives and displays related Sunrise accounts by XUID. */
@Component({
  selector: 'sunrise-gamertags',
  templateUrl: './sunrise-gamertags.component.html',
  styleUrls: ['./sunrise-gamertags.component.scss'],
})
export class SunriseGamertagsComponent implements OnChanges {
  @Input() public xuid?: BigInt;

  public everBannedIcon = faGavel;

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;
  /** The retrieved list of shared users. */
  public sharedConsoleUsers: SunriseSharedConsoleUsers;
  public columnsToDisplay = ['everBanned', 'gamertag', 'sharedConsoleId', 'xuid'];

  public sunriseRouterLink = [
    ...createNavbarPath(NavbarTools.UserDetailsPage).routerLink,
    'sunrise',
  ];

  constructor(private readonly sunrise: SunriseService) {}

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (this.xuid === undefined) {
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;
    this.sunrise.getSharedConsoleUsersByXuid(this.xuid).subscribe(
      sharedConsoleUsers => {
        this.isLoading = false;
        this.sharedConsoleUsers = sharedConsoleUsers;
      },
      _error => {
        this.isLoading = false;
        this.loadError = _error; // TODO: Display something useful to the user
      },
    );
  }
}
