import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { environment } from '@environments/environment';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { Navigate } from '@ngxs/router-plugin';
import {
  Action,
  Actions,
  ofActionSuccessful,
  Selector,
  State,
  StateContext,
  Store,
} from '@ngxs/store';
import { LoggerService, LogTopic } from '@services/logger';
import { WindowService } from '@services/window';
import { UserService } from '@shared/services/user';
import { clone, cloneDeep } from 'lodash';
import { concat, from, Observable, of, throwError } from 'rxjs';
import { catchError, filter, first, map, switchMap, take, tap, timeout } from 'rxjs/operators';
import { UserSettingsState } from '../user-settings/user-settings.state';

import {
  BreakAccessToken,
  GetUser,
  LogoutUser,
  RecheckAuth,
  RequestAccessToken,
  ResetAccessToken,
  ResetUserProfile,
  SetLiveOpsAdminSecondaryRole,
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
    private readonly logger: LoggerService,
    private readonly store: Store,
    private readonly windowService: WindowService,
    private readonly actions$: Actions,
  ) {}

  /** Logs out the current user and directs them to the auth page. */
  @Action(LogoutUser, { cancelUncompleted: true })
  public logoutUser(ctx: StateContext<UserStateModel>, action: LogoutUser): Observable<void> {
    this.logger.log([LogTopic.AuthInterception], `[user.state] logoutUser`);
    return ctx.dispatch([
      new ResetUserProfile(),
      new Navigate([`/auth/logout`], { from: action.returnRoute }),
    ]);
  }

  /** Logs out the current user and directs them to the auth page. */
  @Action(RecheckAuth, { cancelUncompleted: true })
  public recheckAuth(ctx: StateContext<UserStateModel>, _action: RecheckAuth): Observable<void> {
    this.logger.log([LogTopic.AuthInterception], `[user.state] recheckAuth`);
    const resetUserProfile$ = ctx.dispatch(new ResetUserProfile());
    const requestAccessToken$ = this.actions$.pipe(
      ofActionSuccessful(ResetAccessToken),
      first(),
      switchMap(() => ctx.dispatch(new RequestAccessToken())),
    );
    return concat(resetUserProfile$, requestAccessToken$);
  }

  /** Action that requests user profile and sets it to the state. */
  @Action(GetUser, { cancelUncompleted: true })
  public getUser(ctx: StateContext<UserStateModel>): Observable<UserModel> {
    this.logger.log([LogTopic.AuthInterception], `[user.state] getUser`);
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
    this.logger.log([LogTopic.AuthInterception], `[user.state] resetUserProfile`);
    ctx.patchState({ profile: undefined });
    return ctx.dispatch(new ResetAccessToken());
  }

  /** Action thats sets state user profile to null. */
  @Action(SetNoUserProfile, { cancelUncompleted: true })
  public setNoUserProfile(ctx: StateContext<UserStateModel>): void {
    this.logger.log([LogTopic.AuthInterception], `[user.state] setNoUserProfile`);
    ctx.patchState({ profile: null });
  }

  /** Action that requests user access token from azure app. */
  @Action(RequestAccessToken, { cancelUncompleted: true })
  public requestAccessToken(ctx: StateContext<UserStateModel>): Observable<void> {
    this.logger.log([LogTopic.AuthInterception], `[user.state] requestAccessToken`);
    // If access token exists, exit logic
    const currentState = ctx.getState();
    if (currentState.accessToken) {
      this.logger.log(
        [LogTopic.AuthInterception],
        `[user.state] [requestAccessToken] token exists`,
      );
      return of();
    }

    const isLoggedIn = !!this.authService.getAccount();
    if (!isLoggedIn) {
      this.logger.log(
        [LogTopic.AuthInterception],
        `[user.state] [requestAccessToken] not logged in`,
      );
      ctx.patchState({ accessToken: null });
      return ctx.dispatch(new SetNoUserProfile());
    }

    this.logger.log(
      [LogTopic.AuthInterception],
      `[user.state] [requestAccessToken] acquireTokenSilent`,
    );

    const location = this.windowService.location();
    const useStaging =
      this.store.selectSnapshot<boolean>(UserSettingsState.enableStagingApi) &&
      location?.origin === environment.stewardUiStagingUrl;
    return from(
      this.authService.acquireTokenSilent({
        scopes: [environment.azureAppScope],
        redirectUri: `${
          useStaging ? environment.stewardUiStagingUrl : environment.stewardUiUrl
        }/auth/aad-login`,
      }),
    ).pipe(
      tap(() =>
        this.logger.log(
          [LogTopic.AuthInterception],
          `[user.state] [requestAccessToken] [acquireTokenSilent] completed`,
        ),
      ),
      switchMap(data => {
        if (!data.accessToken) {
          this.logger.log(
            [LogTopic.AuthInterception],
            `[user.state] [requestAccessToken] [acquireTokenSilent] no access token`,
          );
          ctx.patchState({ accessToken: null });
          return ctx.dispatch(new SetNoUserProfile());
        } else {
          this.logger.log(
            [LogTopic.AuthInterception],
            `[user.state] [requestAccessToken] [acquireTokenSilent] has access token`,
          );
          ctx.patchState({ accessToken: clone(data.accessToken) });
          return ctx.dispatch(new GetUser());
        }
      }),
      catchError(e => {
        this.logger.log(
          [LogTopic.AuthInterception],
          `[user.state] [requestAccessToken] [acquireTokenSilent] error`,
          e,
        );
        ctx.patchState({ accessToken: null });
        return concat(ctx.dispatch(new SetNoUserProfile()), throwError(e));
      }),
    );
  }

  /** Action that resets state access token. */
  @Action(ResetAccessToken, { cancelUncompleted: true })
  public resetAccessToken(ctx: StateContext<UserStateModel>): void {
    this.logger.log([LogTopic.AuthInterception], `[user.state] resetAccessToken`);
    ctx.patchState({ accessToken: undefined });
  }

  /** Action that resets state access token. */
  @Action(BreakAccessToken, { cancelUncompleted: true })
  public breakAccessToken(ctx: StateContext<UserStateModel>): void {
    this.logger.log([LogTopic.AuthInterception], `[user.state] breakAccesstoken`);
    ctx.patchState({ accessToken: 'i am a potato' });
  }

  /** Action thats sets state live ops secondary role. */
  @Action(SetLiveOpsAdminSecondaryRole, { cancelUncompleted: true })
  public setLiveOpsAdminSecondaryRole(
    ctx: StateContext<UserStateModel>,
    action: SetLiveOpsAdminSecondaryRole,
  ): void {
    const state = ctx.getState();
    const profile = state.profile;
    if (profile?.role === UserRole.LiveOpsAdmin) {
      profile.liveOpsAdminSecondaryRole = action.secondaryRole;
      ctx.patchState({ profile: cloneDeep(profile) });
    }
  }

  /** Helper function that timeouts state checks for user profile. */
  public static latestValidProfile$(profile$: Observable<UserModel>): Observable<UserModel> {
    const obs = profile$.pipe(
      filter(x => x !== undefined),
      map(profile => {
        return this.useSecondaryRoleIfAllowed(profile);
      }),
      take(1),
      timeout(10_000),
    );

    return obs;
  }

  /** Selector for state user profile. */
  @Selector()
  public static profile(state: UserStateModel): UserModel {
    const profile = state.profile;
    return this.useSecondaryRoleIfAllowed(profile);
  }

  /** Selector for state user profile's true data. */
  @Selector()
  public static profileForceTrueData(state: UserStateModel): UserModel {
    return state.profile;
  }

  /** Selector for state user access token. */
  @Selector()
  public static accessToken(state: UserStateModel): string {
    return state.accessToken;
  }

  /** Sets the live ops secondary role to the returned profile's role property. */
  private static useSecondaryRoleIfAllowed(profile: UserModel): UserModel {
    const clonedProfile = cloneDeep(profile); // Clone required, selectors can mutate local storage of referenced state object
    if (clonedProfile.role === UserRole.LiveOpsAdmin && !!clonedProfile.liveOpsAdminSecondaryRole) {
      clonedProfile.role = profile.liveOpsAdminSecondaryRole;
    }

    return clonedProfile;
  }
}
