// General
import { MsalService } from '@azure/msal-angular';
import { environment } from '@environments/environment';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { UserModel } from '@shared/models/user.model';
import { UserService } from '@shared/services/user';
import { asapScheduler, from, Observable, of, throwError } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, take, tap, timeout } from 'rxjs/operators';

import { GetUser, RequestAccessToken, ResetAccessToken, ResetUserProfile, SetNoUserProfile } from './user.actions';

// Models


// State


// Services

export class UserStateModel {
    profile?: UserModel;
    accessToken?: string;
}

@State<Partial<UserStateModel>>({
    name: 'user',
    defaults: {
        // undefined means profile hasn't been determined
        // null means user not signed in
        // defined, means user is signed in
        profile: undefined,
        accessToken: undefined,
    }
})
export class UserState {
    constructor(
        private userService: UserService,
        private authService: MsalService
    ) {}

    @Action(GetUser, { cancelUncompleted: true })
    getUser(ctx: StateContext<UserStateModel>, action: GetUser) {
        this.userService.getUserProfile().subscribe(data => {
                ctx.patchState({ profile: data });
            },err => {
                ctx.patchState({ profile: null });
            });
    }

    @Action(ResetUserProfile, { cancelUncompleted: true })
    resetUserProfile(ctx: StateContext<UserStateModel>, action: ResetUserProfile) {
        ctx.patchState({ profile: undefined });
        asapScheduler.schedule(() => ctx.dispatch(new ResetAccessToken()));
    }

    @Action(SetNoUserProfile, { cancelUncompleted: true })
    setNoUserProfile(ctx: StateContext<UserStateModel>, action: SetNoUserProfile) {
        ctx.patchState({ profile: null });
    }

    @Action(RequestAccessToken, { cancelUncompleted: true })
    requestAccessToken(ctx: StateContext<UserStateModel>, action: RequestAccessToken) {
        const isLoggedIn = !!(this.authService.getAccount());
        if (!isLoggedIn) {
            ctx.patchState({ accessToken: null });
            asapScheduler.schedule(() => ctx.dispatch(new SetNoUserProfile()));
            return;
        }

        this.authService.acquireTokenSilent({
            scopes: [environment.azureAppScope]
        }).then(data => {
                if (!data.accessToken) {
                    ctx.patchState({ accessToken: null });
                    asapScheduler.schedule(() => ctx.dispatch(new SetNoUserProfile()));
                    return;
                }

                ctx.patchState({ accessToken: data.accessToken });
                asapScheduler.schedule(() => ctx.dispatch(new GetUser()));
            },err => {
                ctx.patchState({ accessToken: null });
                asapScheduler.schedule(() => ctx.dispatch(new SetNoUserProfile()));
            });
    }

    @Action(ResetAccessToken, { cancelUncompleted: true })
    resetAccessToken(ctx: StateContext<UserStateModel>, action: ResetAccessToken) {
        ctx.patchState({ accessToken: undefined });
    }

    static latestValidProfile(
        profile$: Observable<UserModel>
    ): Observable<UserModel> {
        const obs = profile$.pipe(
            filter(x => x !== undefined),
            take(1)
        ).pipe(timeout(5000));

        return obs;
    }

    @Selector()
    static profile(state: UserStateModel) {
        return state.profile;
    }

    @Selector()
    static accessToken(state: UserStateModel) {
        return state.accessToken;
    }
}
