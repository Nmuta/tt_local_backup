import { Component, Input } from '@angular/core';
import { environment } from '@environments/environment';

@Component({
    selector: 'profile',
    templateUrl: './profile.html',
    styleUrls: ['./profile.scss']
})
export class ProfileCmpt {
    @Input() email: string;
    @Input() role: string;

    profileTabVisible: boolean = false;

    constructor() {}
    
    public openAuthPageInNewTab() {
        window.open(`${environment.clientUrl}/auth`, '_blank')
    }

    public openProfile() {
        this.profileTabVisible = !this.profileTabVisible;
    }
}