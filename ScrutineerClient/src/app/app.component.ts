import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { RequestAccessToken } from '@shared/state/user/user.actions';
import { WindowService } from '@shared/services/window';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{

    constructor(
        private store: Store,
        private windowService: WindowService
    ) { }

    public ngOnInit() {
        this.windowService.initZafClient();
        this.store.dispatch(new RequestAccessToken());
    }
}
