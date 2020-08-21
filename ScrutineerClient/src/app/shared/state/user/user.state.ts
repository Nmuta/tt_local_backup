// General
import { from, Observable, of, throwError, asapScheduler } from 'rxjs';
import { tap, catchError, timeout, map, filter, take, mergeMap, switchMap } from 'rxjs/operators';
import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { environment } from '@environments/environment';

// Models


// State
import { GetUser, ResetUserProfile, SetNoUserProfile, RequestAccessToken, ResetAccessToken } from './user.actions';
import { UserService } from '@shared/services/user';
import { UserModel } from '@shared/models/user.model';
import { MsalService } from '@azure/msal-angular';


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

    @Action(GetUser, { cancelUncompleted: true })
    getUser(ctx: StateContext<UserStateModel>, action: GetUser) {
        this.userService.getUserProfile().subscribe(
            (data) => {
                ctx.patchState({ profile: data });
            },
            (err) => {
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
            scopes: ['api://cfe0ac3f-d0a7-4566-99f7-0c56b7a9f7d4/api_access']
        }).then(
            (data) => {
                if (!data.accessToken) {
                    ctx.patchState({ accessToken: null });
                    asapScheduler.schedule(() => ctx.dispatch(new SetNoUserProfile()));
                    return;
                }

                ctx.patchState({ accessToken: data.accessToken });
                asapScheduler.schedule(() => ctx.dispatch(new GetUser()));
            },
            (err) => {
                ctx.patchState({ accessToken: null });
                asapScheduler.schedule(() => ctx.dispatch(new SetNoUserProfile()));
            });
    }

    @Action(ResetAccessToken, { cancelUncompleted: true })
    resetAccessToken(ctx: StateContext<UserStateModel>, action: ResetAccessToken) {
        ctx.patchState({ accessToken: undefined });
    }
}
