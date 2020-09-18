import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { RequestAccessToken } from '@shared/state/user/user.actions';

/** Defines the app component. */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public titles = ['one', 'Two', 3, 'fore'];

  constructor(private store: Store) {}

  /** Logic for the OnInit component lifecycle. */
  public ngOnInit() {
    this.store.dispatch(new RequestAccessToken());
  }
}
