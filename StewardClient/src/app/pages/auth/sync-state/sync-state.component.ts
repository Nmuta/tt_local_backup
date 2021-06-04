import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { Select, Store } from '@ngxs/store';
import { SyncUserState } from '@shared/state/user/user.actions';
import { UserState } from '@shared/state/user/user.state';
import { UserStateModel } from '@shared/state/user/user.state.model';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/** Routed component that allows manual setting of the user state via page access. */
@Component({
  templateUrl: './sync-state.component.html',
  styleUrls: ['./sync-state.component.scss'],
})
export class SyncStateComponent extends BaseComponent implements OnInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  public model: UserStateModel;

  constructor(private readonly route: ActivatedRoute, private readonly store: Store) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntil(this.onDestroy$)).subscribe(q => {
      this.model = {
        accessToken: q.get('accessToken'),
        profile: {
          emailAddress: q.get('emailAddress'),
          role: q.get('role') as UserRole,
          name: q.get('name'),
          objectId: q.get('objectId'),
          liveOpsAdminSecondaryRole: undefined,
        },
      };

      this.store.dispatch(new SyncUserState(this.model));
    });
  }
}
