import { Component, Input, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { Store } from '@ngxs/store';
import { SetAppVersion } from '@shared/state/user-settings/user-settings.actions';
import { UserSettingsState } from '@shared/state/user-settings/user-settings.state';

/** Component for displaying a static data privacy notice. */
@Component({
  selector: 'old-changelog',
  templateUrl: '../../../../CHANGELOG.component.html',
  styleUrls: ['./old-changelog.component.scss'],
})
export class OldChangelogComponent implements OnInit {
  @Input() public expandFirst = true;
  public clientOnNewVersion: boolean = false;
  public isProduction: boolean = false;

  constructor(private readonly store: Store) {}

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.isProduction = environment.production;
    const storedAppVersion = this.store.selectSnapshot<string>(UserSettingsState.appVersion);
    const currentAppVersion = environment.adoVersion;
    this.clientOnNewVersion = currentAppVersion !== storedAppVersion;

    this.store.dispatch(new SetAppVersion(currentAppVersion));
  }
}
