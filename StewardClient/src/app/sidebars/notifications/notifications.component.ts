import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { BackgroundJob, BackgroundJobStatus } from '@models/background-job';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { Store } from '@ngxs/store';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { NotificationsService } from '@shared/hubs/notifications.service';
import { UserState } from '@shared/state/user/user.state';

/** Displays notifications. */
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  public showDevTools = false;
  public notifications: BackgroundJob<unknown>[] = [];
  public backgroundJobRouterLink: string[];

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly jobService: BackgroundJobService,
    private readonly store: Store,
    private readonly router: Router,
  ) {}

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    const profile = this.store.selectSnapshot<UserModel>(UserState.profile);
    this.showDevTools = profile?.role === UserRole.LiveOpsAdmin || !environment.production;

    this.notifications = this.notificationsService.notifications;
    this.notificationsService.notifications$.subscribe(v => {
      this.notifications = v;
    });

    // Background job history is a shared page and will always be on path directly after <app>/tools
    const paths = this.router.url.split('/').filter(path => path !== '');
    const toolsIndex = paths.findIndex(path => path === 'tools');
    this.backgroundJobRouterLink = [
      `/${paths.splice(0, toolsIndex + 1).join('/')}/steward-user-history`,
    ];
  }

  /** Marks a notification as read. */
  public async markRead(notification: BackgroundJob<unknown>, $event: boolean): Promise<void> {
    notification.isMarkingRead = true;
    if ($event) {
      await this.notificationsService.markRead(notification);
    } else {
      await this.notificationsService.markUnread(notification);
    }
  }

  /** Marks all notifications as read. */
  public async markReadAll(): Promise<void> {
    const promises = this.notifications.map(notification => this.markRead(notification, true));
    await Promise.all(promises);
  }

  /** Syncs notifications with the server. */
  public async syncAll(): Promise<void> {
    this.notificationsService.sync();
  }

  /** Make fake job. Triggered on button press. */
  public makeFakeFailure(): void {
    this.jobService
      .makeFakeBackgroundJob$(1000, BackgroundJobStatus.Failed, { fake: 'fake' })
      .subscribe();
  }

  /** Make fake job. Triggered on button press. */
  public makeFakeSuccess(): void {
    this.jobService
      .makeFakeBackgroundJob$(1000, BackgroundJobStatus.Completed, { fake: 'fake' })
      .subscribe();
  }

  /** Make fake job. Triggered on button press. */
  public makeFakeOngoing(): void {
    this.jobService
      .makeFakeBackgroundJob$(1000, BackgroundJobStatus.InProgress, { fake: 'fake' })
      .subscribe();
  }
}
