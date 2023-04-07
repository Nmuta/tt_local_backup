import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { Select, Store } from '@ngxs/store';
import { ConfigureShowVerifyCheckboxPopup } from '@shared/state/user-settings/user-settings.actions';
import { UserSettingsState } from '@shared/state/user-settings/user-settings.state';
import { Observable } from 'rxjs';

/** Displays the verify checkbox help popover. */
@Component({
  selector: 'verify-button',
  templateUrl: './verify-button.component.html',
  styleUrls: ['./verify-button.component.scss'],
})
export class VerifyButtonComponent extends BaseComponent {
  @Select(UserSettingsState.showVerifyCheckboxPopup)
  public showVerifyCheckboxPopup$: Observable<boolean>;
  /** Sets the disabled state of the verify button. */
  @Input() public disabled: boolean = false;
  /** Change event for isVerified. */
  @Output() public isVerifiedChange = new EventEmitter<boolean>();

  public isVerified: boolean = false;

  constructor(private readonly store: Store) {
    super();
  }

  /** Sets the show verify checkbox popup value in settings. */
  public setShowVerifyCheckboxPopup(show: boolean): void {
    this.store.dispatch(new ConfigureShowVerifyCheckboxPopup(show));
  }

  /** Changes the verify status of the button. */
  public changeVerifyStatus(isVerified: boolean): void {
    this.isVerified = isVerified;
    this.isVerifiedChange.emit(this.isVerified);
  }
}
