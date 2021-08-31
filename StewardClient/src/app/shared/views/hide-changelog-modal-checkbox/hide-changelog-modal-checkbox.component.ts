import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { Select, Store } from '@ngxs/store';
import { ConfigureAppUpdatePopup } from '@shared/state/user-settings/user-settings.actions';
import { UserSettingsState } from '@shared/state/user-settings/user-settings.state';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/** Component for displaying a checkbox to hide changelog notifications. */
@Component({
  selector: 'hide-changelog-modal-checkbox',
  templateUrl: './hide-changelog-modal-checkbox.component.html',
  styleUrls: ['./hide-changelog-modal-checkbox.component.scss'],
})
export class HideChangelogModalCheckboxComponent extends BaseComponent implements OnInit {
  @Select(UserSettingsState.showAppUpdatePopup) public showAppUpdatePopup$: Observable<boolean>;

  public showAppUpdatePopup: boolean;

  constructor(private readonly store: Store) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.showAppUpdatePopup$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((showAppUpdatePopup: boolean) => {
        if (typeof showAppUpdatePopup !== 'undefined') {
          this.showAppUpdatePopup = showAppUpdatePopup;
        } else {
          this.store.dispatch(new ConfigureAppUpdatePopup(true));
          this.showAppUpdatePopup = true;
        }
      });
  }

  /** Flips the state showAppUpdatePopup boolean. */
  public change(): void {
    this.store.dispatch(new ConfigureAppUpdatePopup(!this.showAppUpdatePopup));
  }
}
