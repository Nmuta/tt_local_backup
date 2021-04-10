import { Component, OnInit } from '@angular/core';
import {
  faCog,
  faExclamationTriangle,
  faInfoCircle,
  faSyncAlt,
  faTasks,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { UserModel } from '@models/user.model';
import { Select } from '@ngxs/store';
import { WindowService } from '@services/window';
import { ZendeskService } from '@services/zendesk';
import { UserState } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';

import { createNavbarPath, navbarToolList, NavbarTools } from '@navbar-app/navbar-tool-list';
import { RouterLinkPath } from '@models/routing';
import { NotificationsService } from '@shared/hubs/notifications.service';
import { BackgroundJobStatus } from '@models/background-job';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { icon } from '@fortawesome/fontawesome-svg-core';

/** The shared top-level navbar. */
@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  public warningIcon = faExclamationTriangle;
  public refreshIcon = faSyncAlt;
  public infoIcon = faInfoCircle;
  public items: RouterLinkPath[] = navbarToolList;
  public homeRouterLink = createNavbarPath(NavbarTools.HomePage).routerLink;

  public readonly profileIcon = faUser;
  public readonly settingsIcon = faCog;
  public readonly notificationsIcon = faTasks;
  public notificationCount = null;
  public notificationColor: 'default' | 'warn' = 'default';

  constructor(
    private readonly windowService: WindowService,
    private readonly zendeskService: ZendeskService,
    private readonly notificationsService: NotificationsService,
    registry: MatIconRegistry,
    sanitizer: DomSanitizer,
  ) {
    const faTasksSvg = icon(faTasks).html.join('');
    registry.addSvgIconLiteral('fa-tasks', sanitizer.bypassSecurityTrustHtml(faTasksSvg));
  }

  /**
   * Lifecycle hook.
   * TODO: Remove when Kusto feature is ready.
   */
  public ngOnInit(): void {
    this.notificationsService.notifications$.subscribe(notifications => {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      this.notificationCount = unreadNotifications.length ? unreadNotifications.length : null;
      this.notificationColor = unreadNotifications.some(
        n => n.status === BackgroundJobStatus.Failed,
      )
        ? 'warn'
        : 'default';
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
