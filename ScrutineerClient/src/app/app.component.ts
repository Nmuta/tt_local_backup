import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { RequestAccessToken } from '@shared/state/user/user.actions';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

    constructor(
        private store: Store
    ) { }

    public ngOnInit() {
        this.store.dispatch(new RequestAccessToken());
    }
}
