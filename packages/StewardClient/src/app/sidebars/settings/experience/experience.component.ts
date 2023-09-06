import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { Select, Store } from '@ngxs/store';
import { ChangelogService } from '@services/changelog/changelog.service';
import { ConfigureShowVerifyCheckboxPopup } from '@shared/state/user-settings/user-settings.actions';
import {
  UserSettingsState,
  UserSettingsStateModel,
} from '@shared/state/user-settings/user-settings.state';
import { Observable, takeUntil } from 'rxjs';

/** Basic UX settings. */
@Component({
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
})
export class ExperienceComponent extends BaseComponent implements OnInit {
  @Select(UserSettingsState) public userSettings$: Observable<UserSettingsStateModel>;
  public showVerifyCheckboxPopup: boolean;

  constructor(
    private readonly store: Store,
    private readonly changelogService: ChangelogService,
  ) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.userSettings$.pipe(takeUntil(this.onDestroy$)).subscribe(latest => {
      this.showVerifyCheckboxPopup = latest.showVerifyCheckboxPopup;
    });
  }

  /** Sets the show verify checkbox popup value in settings. */
  public setShowVerifyCheckboxPopup(): void {
    this.store.dispatch(new ConfigureShowVerifyCheckboxPopup(this.showVerifyCheckboxPopup));
  }

  /** True when the automatic popup is disabled. */
  public get enableAutomaticChangelogPopup(): boolean {
    return !this.changelogService.disableAutomaticPopup;
  }

  /** Sets the state of automatic popup disabling. */
  public set enableAutomaticChangelogPopup(value: boolean) {
    this.changelogService.disableAutomaticPopup = !value;
  }
}
