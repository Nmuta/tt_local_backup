import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '@components/base-component/base.component';
import { environment } from '@environments/environment';
import { BackgroundJobStatus } from '@models/background-job';
import { Select } from '@ngxs/store';
import { ChangelogService } from '@services/changelog/changelog.service';
import { NotificationsService } from '@shared/hubs/notifications.service';
import { ChangelogState } from '@shared/state/changelog/changelog.state';
import { UserSettingsService } from '@shared/state/user-settings/user-settings.service';
import { Observable, takeUntil } from 'rxjs';

/** Handles the unified sidebar selector. */
@Component({
  templateUrl: './sidebars.component.html',
  styleUrls: ['./sidebars.component.scss'],
})
export class SidebarsComponent extends BaseComponent implements AfterViewInit {
  @ViewChild('changelogLink', { read: ElementRef }) changelogLink: ElementRef;
  @Select(ChangelogState.allPendingIds) public allPendingIds$: Observable<string[]>;
  public changelogNotificationCount = 0;

  public notificationCount = null;
  public notificationColor: ThemePalette = undefined;

  /** Gets the ado version from the environment. */
  public get adoVersion(): string {
    return environment.adoVersion;
  }
  constructor(
    private readonly userSettingsService: UserSettingsService,
    private readonly changelogService: ChangelogService,
    private readonly notificationsService: NotificationsService,
    protected dialog: MatDialog,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngAfterViewInit(): void {
    // this.notificationsService.initialize();
    if (!!this.userSettingsService.appVersion) {
      const currentVersion = environment.adoVersion;
      const isNewAppVersion = currentVersion !== this.userSettingsService.appVersion;
      if (isNewAppVersion) {
        if (!this.changelogService.disableAutomaticPopup) {
          this.changelogLink?.nativeElement?.click();
        }
      }
    } else {
      this.userSettingsService.appVersion = environment.adoVersion;
    }

    this.allPendingIds$.pipe(takeUntil(this.onDestroy$)).subscribe(v => {
      this.changelogNotificationCount = v?.length ?? 0;
    });

    this.notificationsService.notifications$.subscribe(notifications => {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      this.notificationCount = unreadNotifications.length ? unreadNotifications.length : null;
      this.notificationColor = unreadNotifications.some(
        n => n.status === BackgroundJobStatus.Failed,
      )
        ? 'accent'
        : undefined;
    });
  }
}
