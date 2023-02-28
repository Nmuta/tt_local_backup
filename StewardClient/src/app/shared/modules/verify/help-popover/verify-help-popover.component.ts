import { Component } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { Select, Store } from '@ngxs/store';
import { ConfigureShowVerifyCheckboxPopup } from '@shared/state/user-settings/user-settings.actions';
import { UserSettingsState } from '@shared/state/user-settings/user-settings.state';
import { Observable } from 'rxjs';

/** Displays the verify checkbox help popover. */
@Component({
  selector: 'verify-help-popover',
  templateUrl: './verify-help-popover.component.html',
  styleUrls: ['./verify-help-popover.component.scss'],
})
export class VerifyHelpPopoverComponent extends BaseComponent {
  @Select(UserSettingsState.showVerifyCheckboxPopup)
  public showVerifyCheckboxPopup$: Observable<boolean>;

  constructor(private readonly store: Store) {
    super();
  }

  /** Sets the show verify checkbox popup value in settings. */
  public setShowVerifyCheckboxPopup(show: boolean): void {
    this.store.dispatch(new ConfigureShowVerifyCheckboxPopup(show));
  }
}
