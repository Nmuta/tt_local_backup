import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { environment } from '@environments/environment';
import { UserModel } from '@models/user.model';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import { PermissionsService } from '@services/api-v2/permissions/permissions.service';
import { PermAttributesService } from '@services/perm-attributes/perm-attributes.service';
import { RequestAccessToken } from '@shared/state/user/user.actions';
import { UserState } from '@shared/state/user/user.state';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { includes } from 'lodash';

/** A guard for preventing unauthenticated access and directing users to the auth flow. */
@Injectable({
  providedIn: 'root',
})
export class AuthV2Guard implements CanActivate, CanActivateChild {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly permAttributesService: PermAttributesService,
    private readonly store: Store,
  ) {}

  /** Checks for tool restrictions. */
  public canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    const urlNoQuery = state.url.split('?')[0];
    const redirectAction = new Navigate(['/auth/login'], { from: urlNoQuery });
    const unauthorizedAction = new Navigate(['/unauthorized'], { source: state.url || '' });

    // Find the correct tool in the tool list
    const homeTile = environment.tools.find(homeTile => includes(state.url, homeTile.tool));

    // Shouldnt happen but if tool cannot be found, assume no restrictions.
    if (!homeTile) return of(true);

    this.store.dispatch(new RequestAccessToken());
    return UserState.latestValidProfile$(this.profile$).pipe(
      catchError(_e => {
        this.store.dispatch(redirectAction);
        return of(false);
      }),
      switchMap(profile =>
        this.permissionsService.getUserPermissionAttributes$(profile as UserModel),
      ),
      switchMap(() => this.permAttributesService.initializationGuard$),
      switchMap(() => {
        let isMissingPerms = false;

        // Process the tool's perm restrictions
        if (homeTile?.restriction?.requiredPermissions?.length > 0) {
          isMissingPerms = homeTile.restriction.requiredPermissions
            .map(perm => this.permAttributesService.hasFeaturePermission(perm))
            .includes(false);
        }

        if (isMissingPerms) {
          this.store.dispatch(unauthorizedAction);
        }
        return of(!isMissingPerms);
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
