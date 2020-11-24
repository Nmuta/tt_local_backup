import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { Select, Store } from '@ngxs/store';
import { SetFakeApi } from '@shared/state/user-settings/user-settings.actions';
import { UserSettingsState, UserSettingsStateModel } from '@shared/state/user-settings/user-settings.state';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/** Component for handling user settings. */
@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends BaseComponent implements OnInit {
  @Select(UserSettingsState) private settings$: Observable<UserSettingsStateModel>;

  public enableFakeApi: boolean;

  constructor(private readonly store: Store) { super(); }

  /** Initialization hook. */
  public ngOnInit(): void {
    this.settings$.pipe(takeUntil(this.onDestroy$)).subscribe(latest => this.enableFakeApi = latest.enableFakeApi);
  }

  /** Fired when any setting changes. */
  public syncSettings(): void {
    this.store.dispatch(new SetFakeApi(this.enableFakeApi));
  }
}
