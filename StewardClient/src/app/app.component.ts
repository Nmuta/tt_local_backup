import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { RequestAccessToken } from '@shared/state/user/user.actions';

/** Defines the app component. */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private readonly store: Store) {
    this.store.dispatch(new RequestAccessToken());
  }
}
