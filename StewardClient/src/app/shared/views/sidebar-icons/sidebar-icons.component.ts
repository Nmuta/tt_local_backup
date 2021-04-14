import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { UserSettingsState } from '@shared/state/user-settings/user-settings.state';
import { faCog, faUser } from '@fortawesome/free-solid-svg-icons';
import { SetAppVersion } from '@shared/state/user-settings/user-settings.actions';
import { environment } from '@environments/environment';

/** A menu dropdown with links to all Steward Apps. */
@Component({
  selector: 'sidebar-icons',
  templateUrl: './sidebar-icons.component.html',
  styleUrls: ['./sidebar-icons.component.scss'],
})
export class SidebarIconsComponent implements OnInit {
  public settingsNotificationCount: number = 0;

  public readonly profileIcon = faUser;
  public readonly settingsIcon = faCog;

  constructor(private readonly store: Store) {}

  /** Lifecycle hook. */
  public ngOnInit(): void {
    const storedAppVersion = this.store.selectSnapshot<string>(UserSettingsState.appVersion);
    if (!!storedAppVersion) {
      const currentVersion = environment.adoVersion;
      this.settingsNotificationCount += currentVersion !== storedAppVersion ? 1 : 0;
    } else {
      this.store.dispatch(new SetAppVersion(environment.adoVersion));
    }
  }

  /** When the settings icon is clicked. */
  public clickedSettings(): void {
    this.settingsNotificationCount = 0;
  }
}
