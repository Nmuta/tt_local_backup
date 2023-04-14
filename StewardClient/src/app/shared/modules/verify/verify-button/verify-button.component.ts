import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { Select, Store } from '@ngxs/store';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ConfigureShowVerifyCheckboxPopup } from '@shared/state/user-settings/user-settings.actions';
import { UserSettingsState } from '@shared/state/user-settings/user-settings.state';
import { Observable, takeUntil } from 'rxjs';

/** Displays the verify checkbox help popover. */
@Component({
  selector: 'verify-button',
  templateUrl: './verify-button.component.html',
  styleUrls: ['./verify-button.component.scss'],
})
export class VerifyButtonComponent extends BaseComponent implements OnInit {
  @Select(UserSettingsState.showVerifyCheckboxPopup)
  public showVerifyCheckboxPopup$: Observable<boolean>;
  /** Sets the disabled state of the verify button. */
  @Input() public disabled: boolean = false;
  /** Optional: Permission attribute to stop verification if permissions are missing. */
  @Input() public permissionAttribute: PermAttributeName;
  /** Optional: Permission game title to stop verification if permissions are missing. */
  @Input() public permissionTitle: GameTitle;

  /** Change event for isVerified. */
  @Output() public isVerifiedChange = new EventEmitter<boolean>();

  public isVerified: boolean = false;
  public showVerifyCheckboxPopup: boolean = true;

  constructor(private readonly store: Store) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.showVerifyCheckboxPopup$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        showVerifyCheckboxPopup => (this.showVerifyCheckboxPopup = showVerifyCheckboxPopup),
      );
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
