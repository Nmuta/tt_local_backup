import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { RequestAccessToken } from '@shared/state/user/user.actions';

/** Defines the app component. */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private store: Store) {}

  /** Logic for the OnInit component lifecycle. */
  public ngOnInit(): void {
    this.store.dispatch(new RequestAccessToken());
  }
}
