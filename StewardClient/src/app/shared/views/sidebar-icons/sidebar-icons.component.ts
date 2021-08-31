import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { UserSettingsState } from '@shared/state/user-settings/user-settings.state';
import { SetAppVersion } from '@shared/state/user-settings/user-settings.actions';
import { environment } from '@environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ChangelogModalComponent } from '@views/changelog-modal/changelog-modal.component';

/** A menu dropdown with links to all Steward Apps. */
@Component({
  selector: 'sidebar-icons',
  templateUrl: './sidebar-icons.component.html',
  styleUrls: ['./sidebar-icons.component.scss'],
})
export class SidebarIconsComponent implements OnInit {
  public settingsNotificationCount: number = 0;

  constructor(private readonly store: Store, protected dialog: MatDialog) {}

  /** Lifecycle hook. */
  public ngOnInit(): void {
    const storedAppVersion = this.store.selectSnapshot<string>(UserSettingsState.appVersion);
    const showAppUpdatePopup = this.store.selectSnapshot<boolean>(
      UserSettingsState.showAppUpdatePopup,
    );
    if (!!storedAppVersion) {
      const currentVersion = environment.adoVersion;
      const isNewAppVersion = currentVersion !== storedAppVersion;
      if (isNewAppVersion) {
        if (showAppUpdatePopup) {
          this.dialog.open(ChangelogModalComponent);
        } else {
          this.settingsNotificationCount += 1;
        }
      }
    } else {
      this.store.dispatch(new SetAppVersion(environment.adoVersion));
    }
  }

  /** When the settings icon is clicked. */
  public clickedSettings(): void {
    this.settingsNotificationCount = 0;
  }
}
