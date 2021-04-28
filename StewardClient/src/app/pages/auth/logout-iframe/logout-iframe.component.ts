import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { UserModel } from '@models/user.model';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

/** This component appears in the iframe while AAD logout is in progress in another window, then redirects to AAD-logout */
@Component({
  templateUrl: './logout-iframe.component.html',
  styleUrls: ['./logout-iframe.component.scss'],
})
export class LogoutIframeComponent extends BaseComponent implements OnInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  constructor(private readonly store: Store) {
    super();
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    const whenLoggedOut$ = this.profile$.pipe(
      takeUntil(this.onDestroy$),
      filter(v => !v),
    );
    whenLoggedOut$.subscribe(() => this.store.dispatch(new Navigate(['/auth/aad-logout'])));
  }
}
