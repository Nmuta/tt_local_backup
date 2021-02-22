// General
import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { environment } from '@environments/environment';
import { Navigate } from '@ngxs/router-plugin';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { UserModel } from '@shared/models/user.model';
import { UserService } from '@shared/services/user';
import { clone } from 'lodash';
import { concat, from, Observable, of, throwError } from 'rxjs';
import { catchError, filter, switchMap, take, tap, timeout } from 'rxjs/operators';

import {
  GetUser,
  LogoutUser,
  RecheckAuth,
  RequestAccessToken,
  ResetAccessToken,
  ResetUserProfile,
  SetNoUserProfile,
} from './user.actions';

/**
 * Defines the user state model.
 * Contains information about a user's identity and their roles.
 */
export class UserStateModel {
  public profile: UserModel;
  public accessToken: string;
}

/**
 * Defines the user state.
 * Manages information about a user's identity and their roles.
 */
@Injectable()
@State<UserStateModel>({
  name: 'user',
  defaults: {
    // undefined means profile hasn't been determined
    // null means user not signed in
    // defined, means user is signed in
    profile: undefined,
    accessToken: undefined,
  },
})
export class UserState {
  constructor(
    private readonly userService: UserService,
    private readonly authService: MsalService,
  ) {}

  /** Logs out the current user and directs them to the auth page. */
  @Action(LogoutUser, { cancelUncompleted: true })
  public logoutUser(ctx: StateContext<UserStateModel>, action: LogoutUser): Observable<void> {
    return ctx.dispatch([
      new ResetUserProfile(),
      new ResetAccessToken(),
      new Navigate([`/auth/logout`], { from: action.returnRoute }),
    ]);
  }

  /** Logs out the current user and directs them to the auth page. */
  @Action(RecheckAuth, { cancelUncompleted: true })
  public recheckAuth(ctx: StateContext<UserStateModel>, _action: RecheckAuth): Observable<void> {
    return ctx.dispatch([new ResetUserProfile(), new RequestAccessToken()]);
  }

  /** Action that requests user profile and sets it to the state. */
  @Action(GetUser, { cancelUncompleted: true })
  public getUser(ctx: StateContext<UserStateModel>): Observable<UserModel> {
    return this.userService.getUserProfile().pipe(
      tap(
        data => {
          ctx.patchState({ profile: clone(data) });
        },
        () => {
          ctx.patchState({ profile: null });
        },
      ),
    );
  }

  /** Action that resets state user profile. */
  @Action(ResetUserProfile, { cancelUncompleted: true })
  public resetUserProfile(ctx: StateContext<UserStateModel>): Observable<void> {
    ctx.patchState({ profile: undefined });
    return ctx.dispatch(new ResetAccessToken());
  }

  /** Action thats sets state user profile to null. */
  @Action(SetNoUserProfile, { cancelUncompleted: true })
  public setNoUserProfile(ctx: StateContext<UserStateModel>): void {
    ctx.patchState({ profile: null });
  }

  /** Action that requests user access token from azure app. */
  @Action(RequestAccessToken, { cancelUncompleted: true })
  public requestAccessToken(ctx: StateContext<UserStateModel>): Observable<void> {
    // If access token exists, exit logic
    const currentState = ctx.getState();
    if (currentState.accessToken) {
      return of();
    }

    const isLoggedIn = !!this.authService.getAccount();
    if (!isLoggedIn) {
      ctx.patchState({ accessToken: null });
      return ctx.dispatch(new SetNoUserProfile());
    }

    return from(
      this.authService.acquireTokenSilent({
        scopes: [environment.azureAppScope],
      }),
    ).pipe(
      switchMap(data => {
        if (!data.accessToken) {
          ctx.patchState({ accessToken: null });
          return ctx.dispatch(new SetNoUserProfile());
        } else {
          ctx.patchState({ accessToken: clone(data.accessToken) });
          return ctx.dispatch(new GetUser());
        }
      }),
      catchError(e => {
        ctx.patchState({ accessToken: null });
        return concat(ctx.dispatch(new SetNoUserProfile()), throwError(e));
      }),
    );
  }

  /** Action that resets state access token. */
  @Action(ResetAccessToken, { cancelUncompleted: true })
  public resetAccessToken(ctx: StateContext<UserStateModel>): void {
    ctx.patchState({ accessToken: undefined });
  }

  /** Helper function that timeouts state checks for user profile. */
  public static latestValidProfile$(profile$: Observable<UserModel>): Observable<UserModel> {
    const obs = profile$.pipe(
      filter(x => x !== undefined),
      take(1),
      timeout(10_000),
    );

    return obs;
  }

  /** Selector for state user profile. */
  @Selector()
  public static profile(state: UserStateModel): UserModel {
    return state.profile;
  }

  /** Selector for state user access token. */
  @Selector()
  public static accessToken(state: UserStateModel): string {
    return state.accessToken;
  }
}
