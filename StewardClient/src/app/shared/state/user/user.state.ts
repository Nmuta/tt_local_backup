// General
import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { environment } from '@environments/environment';
import { Navigate } from '@ngxs/router-plugin';
import { Action, Actions, ofActionDispatched, Selector, State, StateContext, Store } from '@ngxs/store';
import { WindowOpen } from '@services/window';
import { UserModel } from '@shared/models/user.model';
import { UserService } from '@shared/services/user';
import { asapScheduler, Observable } from 'rxjs';
import { filter, map, take, tap, timeout } from 'rxjs/operators';

import {
  GetUser,
  LogoutUser,
  RecheckAuth,
  RequestAccessToken,
  ResetAccessToken,
  ResetUserProfile,
  SetNoUserProfile,
} from './user.actions';

/** Defines the user state model. */
export class UserStateModel {
  public profile?: UserModel;
  public accessToken?: string;
}

/** Defines the user state. */
@Injectable()
@State<Partial<UserStateModel>>({
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
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly userService: UserService,
    private readonly authService: MsalService,
  ) {
  }

  /** Logs out the current user and directs them to the auth page. */
  @Action(LogoutUser, { cancelUncompleted: true })
  public logoutUser(ctx: StateContext<UserStateModel>, action: LogoutUser): Observable<void> {
    return ctx.dispatch([
      new ResetUserProfile(),
      new ResetAccessToken(),
      new Navigate([`/auth`], { queryParams: { from: action.returnRoute } }),
      new WindowOpen(`${environment.stewardUiUrl}/auth/logout`, '_blank'),
    ]);
  }

  /** Logs out the current user and directs them to the auth page. */
  @Action(RecheckAuth, { cancelUncompleted: true })
  public recheckAuth(ctx: StateContext<UserStateModel>, _action: RecheckAuth): Observable<void> {
    return ctx.dispatch([
      new ResetUserProfile(),
      new RequestAccessToken(),
    ]);
  }

  /** Action that requests user profile and sets it to the state. */
  @Action(GetUser, { cancelUncompleted: true })
  public getUser(ctx: StateContext<UserStateModel>): Observable<UserModel> {
    return this.userService.getUserProfile().pipe(tap(
      data => {
        ctx.patchState({ profile: data });
      },
      () => {
        ctx.patchState({ profile: null });
      },
    ));
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
  public async requestAccessToken(ctx: StateContext<UserStateModel>): Promise<void> {
    const isLoggedIn = !!this.authService.getAccount();
    if (!isLoggedIn) {
      ctx.patchState({ accessToken: null });
      await ctx.dispatch(new SetNoUserProfile()).toPromise();
      return;
    }

    try {
      const data = await this.authService.acquireTokenSilent({
        scopes: [environment.azureAppScope],
      });

      if (!data.accessToken) {
        ctx.patchState({ accessToken: null });
        await ctx.dispatch(new SetNoUserProfile()).toPromise();
        return;
      }

      ctx.patchState({ accessToken: data.accessToken });
      await ctx.dispatch(new GetUser()).toPromise();
    } catch (e) {
      ctx.patchState({ accessToken: null });
      await ctx.dispatch(new SetNoUserProfile()).toPromise();
      throw e;
    }
  }

  /** Action that resets state access token. */
  @Action(ResetAccessToken, { cancelUncompleted: true })
  public resetAccessToken(ctx: StateContext<UserStateModel>): void {
    ctx.patchState({ accessToken: undefined });
  }

  /** Helper function that timeouts state checks for user profile. */
  public static latestValidProfile$(profile$: Observable<UserModel>): Observable<UserModel> {
    const obs = profile$
      .pipe(
        filter(x => x !== undefined),
        take(1),
        timeout(5_000),
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
