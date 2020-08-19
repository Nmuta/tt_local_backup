import { Component, OnInit } from '@angular/core';
import { Store, Select, NgxsModule } from '@ngxs/store';
import { Observable } from 'rxjs';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { ZendeskService } from '@shared/services/zendesk';
import { environment } from '../../environments/environment';
import { UserState } from '@shared/state/user/user.state';
import { ResetUserProfile, RequestAccessToken } from '@shared/state/user/user.actions';
import { UserModel } from '@shared/models/user.model';

@Component({
    templateUrl: './auth.html',
    styleUrls: ['./auth.scss']
})
export class AuthCmpt implements OnInit {  
    @Select(UserState.profile) profile$: Observable<UserModel>;

    loading: boolean;
    inZendesk: boolean;
    profile: UserModel; 

    constructor(
        private store: Store,
        private authService: MsalService,
        private zendeskService: ZendeskService
    ) { }

    public ngOnInit() { 
        this.loading = true;
        this.checkIfAppIsOnZendesk();
        UserState.latestValidProfile(this.profile$).subscribe(
            profile => {
                this.profile = profile;
                this.loading = false;
            },
            error => {
                this.profile = null;
                this.loading = false;
            }
        );
    }

    public openAuthPageInNewTab() {
        window.open(`${environment.clientUrl}/auth`, '_blank')
    }

    public login() {
        this.authService.loginRedirect({
            extraScopesToConsent: ['api://cfe0ac3f-d0a7-4566-99f7-0c56b7a9f7d4/api_access']
          });
    }

    public logout() {
        this.authService.logout();
    }

    public checkIfAppIsOnZendesk() {
        this.zendeskService.currentUser().subscribe(
            (user: any) => {
                this.inZendesk = true;
            },
            (err) => {
                this.inZendesk = false;
            });
    } 

    public recheckAuth() {
        this.store.dispatch(new ResetUserProfile());
        this.store.dispatch(new RequestAccessToken());
        this.ngOnInit();
    }
}