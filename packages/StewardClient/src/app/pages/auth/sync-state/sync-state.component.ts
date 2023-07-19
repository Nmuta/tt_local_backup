import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { UserModel } from '@models/user.model';
import { Select, Store } from '@ngxs/store';
import { SyncUserState } from '@shared/state/user/user.actions';
import { UserState } from '@shared/state/user/user.state';
import { UserStateModel } from '@shared/state/user/user.state.model';
import { Observable } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

/** Routed component that allows manual setting of the user state via page access. */
@Component({
  templateUrl: './sync-state.component.html',
  styleUrls: ['./sync-state.component.scss'],
})
export class SyncStateComponent extends BaseComponent implements OnInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  public model: UserStateModel;
  public isSynced: boolean = false;

  constructor(private readonly route: ActivatedRoute, private readonly store: Store) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        switchMap(q => {
          return this.store.dispatch(new SyncUserState(q.get('accessToken')));
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        this.isSynced = true;
      });
  }
}
