import { Component, Input } from '@angular/core';
import { environment } from '@environments/environment';
import { UserModel } from '@shared/models/user.model';
import { WindowService } from '@shared/services/window';

/** Defines the profile component. */
@Component({
    selector: 'profile',
    templateUrl: './profile.html',
    styleUrls: ['./profile.scss']
})
export class ProfileComponent {
    @Input() public user: UserModel;

    public profileTabVisible = false;

    constructor(
        protected windowService: WindowService
    ) {}

    /** Opens the auth page in a new tab. */
    public openAuthPageInNewTab() {
        this.windowService.open(`${environment.clientUrl}/auth`, '_blank');
    }

    /** Changes the profile tab visiblity. */
    public changeProfileTabVisibility() {
        this.profileTabVisible = !this.profileTabVisible;
    }
}
