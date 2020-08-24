import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { UserModel } from '@shared/models/user.model';
import { RequestAccessToken, ResetUserProfile } from '@shared/state/user/user.actions';
import { UserState } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

/** Sidebar app component */
@Component({
    templateUrl: './side-bar.html',
    styleUrls: ['./side-bar.scss']
})
export class SidebarComponent implements OnInit {
    @Select(UserState.profile) profile$: Observable<UserModel>;

    loading: boolean;
    profile: UserModel;

    constructor(
        private router: Router
    ) {}

    /** ngOnInit Method */
    public ngOnInit() {
        this.loading = true;
        UserState.latestValidProfile(this.profile$).subscribe(
            profile => {
                this.loading = false;
                this.profile = profile;
                if (!this.profile) {
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
