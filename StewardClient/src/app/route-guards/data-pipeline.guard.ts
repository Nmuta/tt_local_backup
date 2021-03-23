import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { UserModel } from '@models/user.model';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RequestAccessToken } from '@shared/state/user/user.actions';
import { UserRole } from '@models/enums';

/** A guard for preventing unauthenticated access and directing users to the auth flow. */
@Injectable({
  providedIn: 'root',
})
export class DataPipelineGuard implements CanActivate, CanActivateChild {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  constructor(private readonly store: Store) {}

  /** Checks when the component is first loaded. */
  public canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    // The query portion of the URL doesn't cleanly pass through the redirect process, resulting in 404s. We don't need it, anyway.
    const urlNoQuery = state.url.split('?')[0];
    const redirectAction = new Navigate(['/auth/login'], { from: urlNoQuery });
    const unauthorizedAction = new Navigate(['/unauthorized'], { app: 'Data Pipeline' });

    this.store.dispatch(new RequestAccessToken());

    return UserState.latestValidProfile$(this.profile$).pipe(
      catchError(_e => {
        this.store.dispatch(redirectAction);
        return of(false);
      }),
      map(profile => {
        if (!profile) {
          this.store.dispatch(redirectAction);
          return false;
        }

        const role = (profile as UserModel)?.role;
        switch (role) {
          case UserRole.LiveOpsAdmin:
          case UserRole.DataPipelineAdmin:
          case UserRole.DataPipelineContributor:
          case UserRole.DataPipelineRead:
            return true;
          default:
            this.store.dispatch(unauthorizedAction);
            return false;
        }
      }),
    );
  }

  /** Checks when *any* route changes. */
  public canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute, state);
  }
}
