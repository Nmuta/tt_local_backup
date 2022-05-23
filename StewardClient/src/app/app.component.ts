import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { RequestAccessToken } from '@shared/state/user/user.actions';
import { MatIconRegistryService } from '@services/mat-icon-registry';
import { filter, switchMap, take, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BaseComponent } from '@components/base-component/base.component';
import { UserState } from '@shared/state/user/user.state';
import { UserModel } from '@models/user.model';
import { RefreshEndpointKeys } from '@shared/state/user-settings/user-settings.actions';
import { ThemeService } from '@shared/modules/theme/theme.service';
import { SyncChangelog } from '@shared/state/changelog/changelog.actions';

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
    private readonly themeService: ThemeService, // just loading this as a dependency is enough to force synchronization
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
        switchMap(() => this.store.dispatch(new RefreshEndpointKeys())),
        takeUntil(this.onDestroy$),
      )
      .subscribe();

    this.store.dispatch(new RequestAccessToken());
    this.store.dispatch(new SyncChangelog());
  }
}
