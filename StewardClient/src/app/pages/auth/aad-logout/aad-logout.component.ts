import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';

/** This component appears in the main window after the AAD logout process has completed. */
@Component({
  templateUrl: './aad-logout.component.html',
  styleUrls: ['./aad-logout.component.scss'],
})
export class AadLogoutComponent extends BaseComponent implements OnInit {
  constructor(private readonly store: Store) {
    super();
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    // TODO: this should attempt to detect which type of app it should redirect to, depending on context. for now, 'let the user decide later' is the easy+reliable way
    of(true)
      .pipe(takeUntil(this.onDestroy$), delay(3_000))
      .subscribe(() => this.store.dispatch(new Navigate(['/'])));
  }
}
