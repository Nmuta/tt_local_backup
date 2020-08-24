import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { RequestAccessToken } from '@shared/state/user/user.actions';

/** App component */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

    constructor(
        private store: Store
    ) { }

    /** ngOnInit method */
    public ngOnInit() {
        this.store.dispatch(new RequestAccessToken());
    }
}
