// General
import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { environment } from '@environments/environment';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { UserModel } from '@shared/models/user.model';
import { UserService } from '@shared/services/user';
import { asapScheduler, from, Observable, of, throwError } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  switchMap,
  take,
  tap,
  timeout,
} from 'rxjs/operators';

import {
  GetUser,
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
    private userService: UserService,
    private authService: MsalService,
  ) {}

  /** Action that requests user profile and sets it to the state. */
  @Action(GetUser, { cancelUncompleted: true })
  public getUser(ctx: StateContext<UserStateModel>, action: GetUser) {
    this.userService.getUserProfile().subscribe(
      data => {
        ctx.patchState({ profile: data });
      },
      err => {
        ctx.patchState({ profile: null });
      },
    );
  }

  /** Action that resets state user profile. */
  @Action(ResetUserProfile, { cancelUncompleted: true })
  public resetUserProfile(
    ctx: StateContext<UserStateModel>,
    action: ResetUserProfile,
  ) {
    ctx.patchState({ profile: undefined });
    asapScheduler.schedule(() => ctx.dispatch(new ResetAccessToken()));
  }

  /** Action thats sets state user profile to null. */
  @Action(SetNoUserProfile, { cancelUncompleted: true })
  public setNoUserProfile(
    ctx: StateContext<UserStateModel>,
    action: SetNoUserProfile,
  ) {
    ctx.patchState({ profile: null });
  }

  /** Action that requests user access token from azure app. */
  @Action(RequestAccessToken, { cancelUncompleted: true })
  public requestAccessToken(
    ctx: StateContext<UserStateModel>,
    action: RequestAccessToken,
  ) {
    const isLoggedIn = !!this.authService.getAccount();
    if (!isLoggedIn) {
      ctx.patchState({ accessToken: null });
      asapScheduler.schedule(() => ctx.dispatch(new SetNoUserProfile()));
      return;
    }

    this.authService
      .acquireTokenSilent({
        scopes: [environment.azureAppScope],
      })
      .then(
        data => {
          if (!data.accessToken) {
            ctx.patchState({ accessToken: null });
            asapScheduler.schedule(() => ctx.dispatch(new SetNoUserProfile()));
            return;
          }

          ctx.patchState({ accessToken: data.accessToken });
          asapScheduler.schedule(() => ctx.dispatch(new GetUser()));
        },
        err => {
          ctx.patchState({ accessToken: null });
          asapScheduler.schedule(() => ctx.dispatch(new SetNoUserProfile()));
        },
      );
  }

  /** Action that resets state access token. */
  @Action(ResetAccessToken, { cancelUncompleted: true })
  public resetAccessToken(
    ctx: StateContext<UserStateModel>,
    action: ResetAccessToken,
  ) {
    ctx.patchState({ accessToken: undefined });
  }

  /** Helper function that timeouts state checks for user profile. */
  public static latestValidProfile$(
    profile$: Observable<UserModel>,
  ): Observable<UserModel> {
    const obs = profile$
      .pipe(
        filter(x => x !== undefined),
        take(1),
      )
      .pipe(timeout(5000));

    return obs;
  }

  /** Selector for state user profile. */
  @Selector()
  public static profile(state: UserStateModel) {
    return state.profile;
  }

  /** Selector for state user access token. */
  @Selector()
  public static accessToken(state: UserStateModel) {
    return state.accessToken;
  }
}
