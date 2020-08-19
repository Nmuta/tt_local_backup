import { Component, Input } from '@angular/core';
import { environment } from '@environments/environment';
import { UserModel } from '@shared/models/user.model';

@Component({
    selector: 'profile',
    templateUrl: './profile.html',
    styleUrls: ['./profile.scss']
})
export class ProfileCmpt {
    @Input() user: UserModel;

    profileTabVisible: boolean = false;

    constructor() {}
    
    public openAuthPageInNewTab() {
        window.open(`${environment.clientUrl}/auth`, '_blank')
    }

    public openProfile() {
        this.profileTabVisible = !this.profileTabVisible;
    }
}