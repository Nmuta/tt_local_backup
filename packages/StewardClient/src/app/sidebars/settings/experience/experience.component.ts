import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { Select, Store } from '@ngxs/store';
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

  constructor(private readonly store: Store) {
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
}
