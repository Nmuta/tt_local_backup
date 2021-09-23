import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { RequestAccessToken } from '@shared/state/user/user.actions';
import { MatIconRegistryService } from '@services/mat-icon-registry';
import { InitEndpointKeys } from '@shared/state/endpoint-key-memory/endpoint-key-memory.actions';
import { catchError, filter, switchMap, take, takeUntil } from 'rxjs/operators';
import { InitEndpointKeysError } from '@models/enums';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from '@components/base-component/base.component';
import { UserState } from '@shared/state/user/user.state';
import { UserModel } from '@models/user.model';
import { VerifyEndpointKeyDefaults } from '@shared/state/user-settings/user-settings.actions';

/** Defines the app component. */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends BaseComponent implements OnInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;
  constructor(
    private readonly store: Store,
    private readonly registryService: MatIconRegistryService,
    private readonly snackbar: MatSnackBar,
  ) {
    super();
    this.registryService.initialize();
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    this.profile$
      .pipe(
        filter(profile => !!profile),
        take(1),
        switchMap(() => this.store.dispatch(new InitEndpointKeys())),
        switchMap(() => this.store.dispatch(new VerifyEndpointKeyDefaults())),
        catchError((error: InitEndpointKeysError) => {
          switch (error) {
            case InitEndpointKeysError.LookupFailed:
              this.snackbar.open('Endpoint key lookup failed.', 'Dismiss', {
                panelClass: 'snackbar-warn',
              });
              break;

            case InitEndpointKeysError.SelectionRemoved:
              this.snackbar.open('Defaulted invalid endpoint selections.', 'Dismiss', {
                panelClass: 'snackbar-info',
              });
              break;
            default:
          }

          // NGXS store now has correct values, but local storage did not update due to thrown error
          // Retrigger verify so local storage is updated accordingly
          return this.store.dispatch(new VerifyEndpointKeyDefaults());
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe();

    this.store.dispatch(new RequestAccessToken());
  }
}
