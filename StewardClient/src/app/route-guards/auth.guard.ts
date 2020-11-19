import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { UserModel } from '@models/user.model';
import { Select } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  constructor(private readonly router: Router) {}

  /** Checks when the component is first loaded. */
  public canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return UserState.latestValidProfile$(this.profile$).pipe(
      catchError(_e => {
        this.router.navigate(['/auth/login'], {
          queryParams: { from: state.url },
        });

        return of(false);
      }),
      map(profile => {
        if (profile) {
          return true;
        }

        this.router.navigate(['/auth/login'], {
          queryParams: { from: state.url },
        });

        return false;
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
