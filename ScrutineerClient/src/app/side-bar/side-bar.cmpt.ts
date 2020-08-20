import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UserState } from '@shared/state/user/user.state';
import { UserModel } from '@shared/models/user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ResetUserProfile, RequestAccessToken } from '@shared/state/user/user.actions';

@Component({
    templateUrl: './side-bar.html',
    styleUrls: ['./side-bar.scss']
})
export class SidebarCmpt {
    @Select(UserState.profile) profile$: Observable<UserModel>;

    loading: boolean;
    profile: UserModel; 

    constructor(
        private router: Router,
        private store: Store
    ) {}

    public ngOnInit() {
        this.loading = true;
        UserState.latestValidProfile(this.profile$).subscribe(
            profile => {
                this.loading = false;
                this.profile = profile;
                if(!this.profile) {
                    this.router.navigate([`/auth`], { queryParams: { from: 'sidebar' }});
                    
                }
            },
            error => {
                this.loading = false;
                this.router.navigate([`/auth`], { queryParams: { from: 'sidebar' }});
            }
        );
    }
}