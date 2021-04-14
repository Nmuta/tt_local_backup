import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { Store } from '@ngxs/store';
import { SetAppVersion } from '@shared/state/user-settings/user-settings.actions';
import { UserSettingsState } from '@shared/state/user-settings/user-settings.state';

/** Component for displaying a static data privacy notice. */
@Component({
  selector: 'changelog',
  templateUrl: '../../../../CHANGELOG.component.html',
  styleUrls: ['./changelog.component.scss'],
})
export class ChangelogComponent implements OnInit {
  public clientOnNewVersion: boolean = false;

  constructor(private readonly store: Store) {}

  /** Lifecycle hook. */
  public ngOnInit(): void {
    const storedAppVersion = this.store.selectSnapshot<string>(UserSettingsState.appVersion);
    const currentAppVersion = environment.adoVersion;
    this.clientOnNewVersion = currentAppVersion !== storedAppVersion;

    this.store.dispatch(new SetAppVersion(currentAppVersion));
  }
}
