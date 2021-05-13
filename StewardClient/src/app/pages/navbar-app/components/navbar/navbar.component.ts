import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { WindowService } from '@services/window';
import { ZendeskService } from '@services/zendesk';
import { Observable } from 'rxjs';

import {
  createNavbarPath,
  navbarToolList,
  navbarToolListAdminOnly,
  NavbarTools,
} from '@navbar-app/navbar-tool-list';
import { RouterLinkPath } from '@models/routing';
import { NotificationsService } from '@shared/hubs/notifications.service';
import { BackgroundJobStatus } from '@models/background-job';
import { UserModel } from '@models/user.model';
import { UserState } from '@shared/state/user/user.state';
import { UserRole } from '@models/enums';
import { ThemePalette } from '@angular/material/core';

/** The shared top-level navbar. */
@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public items: RouterLinkPath[] = navbarToolList;
  public adminOnlyItems: RouterLinkPath[] = navbarToolListAdminOnly;
  public homeRouterLink = createNavbarPath(NavbarTools.HomePage).routerLink;

  public notificationCount = null;
  public notificationColor: ThemePalette = undefined;

  public showAdminPages: boolean = false;

  constructor(
    private readonly store: Store,
    private readonly windowService: WindowService,
    private readonly zendeskService: ZendeskService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Lifecycle hook.
   * TODO: Remove when Kusto feature is ready.
   */
  public ngOnInit(): void {
    const profile = this.store.selectSnapshot<UserModel>(UserState.profile);
    this.showAdminPages =
      profile.role === UserRole.LiveOpsAdmin || profile.role === UserRole.SupportAgentAdmin;

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
}
