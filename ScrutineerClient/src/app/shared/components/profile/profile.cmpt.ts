import { Component, Input } from '@angular/core';
import { environment } from '@environments/environment';
import { UserModel } from '@shared/models/user.model';
import { WindowService } from '@shared/services/window';

@Component({
    selector: 'profile',
    templateUrl: './profile.html',
    styleUrls: ['./profile.scss']
})
export class ProfileComponent {
    @Input() user: UserModel;

    public profileTabVisible = false;

    constructor(
        protected windowService: WindowService
    ) {}

    public openAuthPageInNewTab() {
        this.windowService.open(`${environment.clientUrl}/auth`, '_blank')
    }

    public changeProfileTabVisibility() {
        this.profileTabVisible = !this.profileTabVisible;
    }
}