import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { Select, Store } from '@ngxs/store';
import { ChangelogService } from '@services/changelog/changelog.service';
import { ConfigureShowVerifyCheckboxPopup } from '@shared/state/user-settings/user-settings.actions';
import {
  UserSettingsState,
  UserSettingsStateModel,
} from '@shared/state/user-settings/user-settings.state';
import { UserTourService } from '@tools-app/pages/home/tour/tour.service';
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
    private readonly userTourService: UserTourService,
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

  /** True when the automatic changelog popup is enabled. */
  public get enableAutomaticChangelogPopup(): boolean {
    return !this.changelogService.disableAutomaticPopup;
  }

  /** Sets the state of automatic changelog popups. */
  public set enableAutomaticChangelogPopup(value: boolean) {
    this.changelogService.disableAutomaticPopup = !value;
  }

  /** True when automatic user tours are enabled. */
  public get enableAutomaticTours(): boolean {
    return this.userTourService.enableTours;
  }

  /** Sets the state of automatic user tours. */
  public set enableAutomaticTours(value: boolean) {
    this.userTourService.enableTours = value;
  }
}
