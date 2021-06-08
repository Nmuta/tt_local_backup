import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { UserModel } from '@models/user.model';
import { Select, Store } from '@ngxs/store';
import { SetFakeApi } from '@shared/state/user-settings/user-settings.actions';
import { UserSettingsStateModel } from '@shared/state/user-settings/user-settings.state';
import { UserState } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/** Routed component that allows manual setting of the user state via page access. */
@Component({
  templateUrl: './set-fake-api.component.html',
  styleUrls: ['./set-fake-api.component.scss'],
})
export class SetFakeApiComponent extends BaseComponent implements OnInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  public model: Partial<UserSettingsStateModel>;

  constructor(private readonly route: ActivatedRoute, private readonly store: Store) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntil(this.onDestroy$)).subscribe(q => {
      this.model = {};

      const enableFakeApiRaw = q.get('enableFakeApi');
      if (enableFakeApiRaw) {
        this.model.enableFakeApi = JSON.parse(enableFakeApiRaw.toLowerCase());
      }

      this.store.dispatch(new SetFakeApi(this.model.enableFakeApi));
    });
  }
}
