import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { RequestAccessToken } from '@shared/state/user/user.actions';
import { MatIconRegistryService } from '@services/mat-icon-registry';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BaseComponent } from '@components/base-component/base.component';
import { UserState } from '@shared/state/user/user.state';
import { UserModel } from '@models/user.model';
import { RefreshEndpointKeys } from '@shared/state/user-settings/user-settings.actions';
import { ThemeService } from '@shared/modules/theme/theme.service';
import { SyncChangelog } from '@shared/state/changelog/changelog.actions';
import { PermAttributesService } from '@services/perm-attributes/perm-attributes.service';
import { PermissionsService } from '@services/api-v2/permissions/permissions.service';
import { UserTourService } from '@tools-app/pages/home/tour/tour.service';

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
    private readonly permissionsService: PermissionsService,
    private readonly permAttributesService: PermAttributesService,
    private readonly themeService: ThemeService, // just loading this as a dependency is enough to force synchronization
    private readonly userTourService: UserTourService,
  ) {
    super();
    this.registryService.initialize();
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    let user: UserModel;
    this.profile$
      .pipe(
        filter(profile => !!profile),
        take(1),
        tap(profile => (user = profile)),
        switchMap(() => this.store.dispatch(new RefreshEndpointKeys())),
        switchMap(() => this.permissionsService.getUserPermissionAttributes$(user)),
        takeUntil(this.onDestroy$),
      )
      .subscribe();

    this.store.dispatch(new RequestAccessToken());
    this.store.dispatch(new SyncChangelog());
  }
}
