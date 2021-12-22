import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { WindowService } from '@services/window';
import { ZendeskService } from '@services/zendesk';
import { Observable } from 'rxjs';

import { NotificationsService } from '@shared/hubs/notifications.service';
import { BackgroundJobStatus } from '@models/background-job';
import { UserModel } from '@models/user.model';
import { UserState } from '@shared/state/user/user.state';
import { UserRole } from '@models/enums';
import { ThemePalette } from '@angular/material/core';
import {
  environment,
  HomeTileInfo,
  NavbarTool,
  standardRoleTools,
} from '@environments/environment';
import {
  UserSettingsState,
  UserSettingsStateModel,
} from '@shared/state/user-settings/user-settings.state';
import { BaseComponent } from '@components/base-component/base.component';
import { startWith, takeUntil } from 'rxjs/operators';
import { SetNavbarTools } from '@shared/state/user-settings/user-settings.actions';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { chain } from 'lodash';
import { HomeTileInfoForNav, setExternalLinkTarget } from '@helpers/external-links';

/** The shared top-level navbar. */
@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent extends BaseComponent implements OnInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;
  @Select(UserSettingsState) public settings$: Observable<UserSettingsStateModel>;

  public role: UserRole = undefined;
  public listedTools: HomeTileInfoForNav[] = [];
  public standardTools: Partial<Record<NavbarTool, number>> = undefined;
  public hasAccess: Partial<Record<NavbarTool, boolean>> = {};

  public parentRoute: string = '/app/tools/';

  /** True when re-ordering should be enabled. */
  public inEditMode: boolean = false;

  public notificationCount = null;
  public notificationColor: ThemePalette = undefined;

  /** True when app is running inside of Zendesk. */
  public isInZendesk: boolean = false;

  constructor(
    private readonly store: Store,
    private readonly windowService: WindowService,
    private readonly zendeskService: ZendeskService,
    private readonly notificationsService: NotificationsService,
  ) {
    super();
  }

  /**
   * Lifecycle hook.
   * TODO: Remove when Kusto feature is ready.
   */
  public ngOnInit(): void {
    this.zendeskService.inZendesk$.pipe(takeUntil(this.onDestroy$)).subscribe(inZendesk => {
      this.isInZendesk = inZendesk;
    });

    this.notificationsService.initialize();
    const profile = this.store.selectSnapshot<UserModel>(UserState.profile);
    this.role = profile?.role;
    this.profile$.pipe(takeUntil(this.onDestroy$)).subscribe(profile => {
      this.role = profile?.role;
      this.standardTools = standardRoleTools[this.role];
    });

    const settings = this.store.selectSnapshot<UserSettingsStateModel>(UserSettingsState);
    this.settings$.pipe(startWith(settings), takeUntil(this.onDestroy$)).subscribe(settings => {
      const navbarTools = settings.navbarTools || {};
      this.hasAccess = chain(environment.tools)
        .map(v => [v.tool, v.accessList.includes(profile?.role)])
        .fromPairs()
        .value();

      this.listedTools = chain(environment.tools)
        .filter(tool => !!navbarTools[tool.tool])
        .orderBy(tool => navbarTools[tool.tool])
        .map(tool => {
          return setExternalLinkTarget(tool, this.isInZendesk);
        })
        .value();
    });

    this.notificationsService.notifications$.subscribe(notifications => {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      this.notificationCount = unreadNotifications.length ? unreadNotifications.length : null;
      this.notificationColor = unreadNotifications.some(
        n => n.status === BackgroundJobStatus.Failed,
      )
        ? 'warn'
        : undefined;
    });
  }

  /** A string representing the current location */
  public get location(): string {
    return `${this.windowService.location().pathname}${this.windowService.location().search}`;
  }

  /** Emits true when we are missing zendesk. */
  public get missingZendesk$(): Observable<boolean> {
    return this.zendeskService.missingZendesk$;
  }

  /** Configures the navbar with sensible defaults for a given role. */
  public setRoleDefaultNav(): void {
    if (!this.standardTools) {
      return;
    }
    this.store.dispatch(new SetNavbarTools(this.standardTools));
  }

  /** Called when the list is re-ordered. */
  public onDrop($event: CdkDragDrop<HomeTileInfo[]>): void {
    moveItemInArray(this.listedTools, $event.previousIndex, $event.currentIndex);
    const newTools = chain(this.listedTools)
      .map((tool, i) => [tool.tool, i + 1])
      .fromPairs()
      .value();
    this.store.dispatch(new SetNavbarTools(newTools));
  }

  /** Changes the editing mode */
  public setEditMode(mode: boolean): void {
    this.inEditMode = mode;
  }
}
