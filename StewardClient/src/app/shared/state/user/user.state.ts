import { Inject, Injectable } from '@angular/core';
import { MsalBroadcastService, MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import {
  EventMessage,
  EventType,
  IPublicClientApplication,
  PopupRequest,
} from '@azure/msal-browser';
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
import { merge, clone, cloneDeep, first as _first, assign } from 'lodash';
import { concat, from, Observable, of, throwError } from 'rxjs';
import { catchError, filter, first, map, switchMap, take, tap, timeout } from 'rxjs/operators';
import { RefreshEndpointKeys } from '../user-settings/user-settings.actions';
import { UserSettingsState } from '../user-settings/user-settings.state';

import {
  ApplyProfileOverrides,
  BreakAccessToken,
  GetUser,
  LogoutUser,
  RecheckAuth,
  RequestAccessToken,
  ResetAccessToken,
  ResetUserProfile,
  SetNoUserProfile,
  SyncUserState,
} from './user.actions';
import { UserStateModel } from './user.state.model';

/**
 * Defines the user state.
 * Manages information about a user's identity and their roles.
 */
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
@Injectable()
export class UserState {
  constructor(
    private readonly userService: UserService,
    private readonly broadcastService: MsalBroadcastService,
    private readonly msalService: MsalService,
    @Inject(MSAL_INSTANCE) private readonly msalClientApp: IPublicClientApplication,
    private readonly logger: LoggerService,
    private readonly store: Store,
    private readonly windowService: WindowService,
    private readonly actions$: Actions,
  ) {
    // if we have an account in the cache, set it as the active account (may be an issue if there's more than one?)
    const accounts = this.msalClientApp.getAllAccounts();
    const firstAccount = _first(accounts);
    if (firstAccount) {
      this.msalClientApp.setActiveAccount(firstAccount);
    }

    // when a popup flow completes, update the active account
    this.broadcastService.msalSubject$
      .pipe(filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS))
      .subscribe(event => {
        const popupRequest = event.payload as PopupRequest;
        this.msalClientApp.setActiveAccount(popupRequest.account);
      });
  }

  /** Logs out the current user and directs them to the auth page. */
  @Action(LogoutUser, { cancelUncompleted: true })
  public logoutUser$(ctx: StateContext<UserStateModel>, action: LogoutUser): Observable<void> {
    this.logger.log([LogTopic.AuthInterception], `[user.state] logoutUser`);
    return ctx.dispatch([
      new ResetUserProfile(),
      new Navigate([`/auth/logout`], { from: action.returnRoute }),
    ]);
  }

  /** Logs out the current user and directs them to the auth page. */
  @Action(RecheckAuth, { cancelUncompleted: true })
  public recheckAuth$(ctx: StateContext<UserStateModel>, action: RecheckAuth): Observable<void> {
    this.logger.log([LogTopic.AuthInterception], `[user.state] recheckAuth`);
    const resetUserProfile$ = ctx.dispatch(new ResetUserProfile());
    const requestAccessToken$ = this.actions$.pipe(
      ofActionSuccessful(ResetAccessToken),
      first(),
      switchMap(() => ctx.dispatch(new RequestAccessToken(true, action.refreshLspEndpoints))),
    );
    return concat(resetUserProfile$, requestAccessToken$);
  }

  /** Action that requests user profile and sets it to the state. */
  @Action(GetUser, { cancelUncompleted: true })
  public getUser$(ctx: StateContext<UserStateModel>): Observable<UserModel> {
    this.logger.log([LogTopic.AuthInterception], `[user.state] getUser`);
    return this.userService.getUserProfile$().pipe(
      tap({
        next: data => {
          const profile = UserState.analyzeProfile(clone(data));
          ctx.patchState({ profile });

          this.logger.log([LogTopic.UserTracking], 'whoami', profile);
        },
        error: () => {
          ctx.patchState({ profile: null });
        },
      }),
    );
  }

  /** Action that resets state user profile. */
  @Action(ResetUserProfile, { cancelUncompleted: true })
  public resetUserProfile$(ctx: StateContext<UserStateModel>): Observable<void> {
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
  public requestAccessToken$(
    ctx: StateContext<UserStateModel>,
    action: RequestAccessToken,
  ): Observable<void> {
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

    const isLoggedIn = !!this.msalClientApp.getActiveAccount();
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
      this.msalService.acquireTokenSilent({
        forceRefresh: action.forceTokenRefresh,
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

          const actions = [new GetUser()];
          if (action.refreshLspEndpoints) {
            actions.push(new RefreshEndpointKeys());
          }

          return ctx.dispatch(actions);
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
  @Action(ApplyProfileOverrides, { cancelUncompleted: true })
  public applyProfileOverrides(
    ctx: StateContext<UserStateModel>,
    action: ApplyProfileOverrides,
  ): void {
    const state = ctx.getState();
    if (state.profile?.role === UserRole.LiveOpsAdmin) {
      const profile = cloneDeep(state.profile);
      profile.overrides = profile.overrides || {};
      assign(profile.overrides, action.profileOverrides);
      ctx.patchState({ profile });
    }
  }

  /** Action that synchronizes the user state model with the target user state. */
  @Action(SyncUserState, { cancelUncompleted: true })
  public syncUserState(ctx: StateContext<UserStateModel>, action: SyncUserState): void {
    ctx.setState(action.targetUserState);
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
    if (clonedProfile?.role === UserRole.LiveOpsAdmin) {
      merge(clonedProfile, profile.overrides);
    }

    return clonedProfile;
  }

  /** Performs some analysis on the profile. Returns a modified profile. */
  private static analyzeProfile(profile: UserModel): UserModel {
    if (!!profile) {
      profile.isMicrosoftEmail = profile?.emailAddress?.toLowerCase()?.endsWith('@microsoft.com');
    }

    return profile;
  }
}
