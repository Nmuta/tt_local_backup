import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BackgroundJob } from '@models/background-job';
import { NotificationHubEvents } from '@models/enums';
import { Store } from '@ngxs/store';
import { WindowService } from '@services/window';
import { UserState } from '@shared/state/user/user.state';
import { ReauthService } from '@shared/state/utilities/reauth.service';
import { from, Subject } from 'rxjs';

/**
 * You must prepare this service with this.initialize() before use.
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  public notifications$: Subject<BackgroundJob<unknown>[]> = new Subject<
    BackgroundJob<unknown>[]
  >();
  public notifications: BackgroundJob<unknown>[] = [];

  public isStarting = false;
  public isReady = false;
  private notificationsHub: HubConnection;

  constructor(
    private readonly store: Store,
    private readonly windowService: WindowService,
    private readonly reauthService: ReauthService,
  ) {
    this.makeHub();
  }

  /** Initialization method. */
  public async initialize(): Promise<void> {
    // do not initialize twice
    if (this.isReady || this.isStarting) {
      return;
    }

    this.isStarting = true;

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    function doRequest$() {
      return from(self.notificationsHub.start());
    }

    doRequest$()
      .pipe(this.reauthService.reauthOnFailure(this.getUrl(), () => doRequest$()))
      .subscribe(() => (this.isReady = true));
  }

  /** Syncs notifications with the server. */
  public async sync(): Promise<void> {
    if (!this.isReady) {
      throw new Error('Notifications Service is not ready');
    }

    this.notifications = [];
    this.notifications$.next(this.notifications);
    await this.notificationsHub.invoke(NotificationHubEvents.SyncAllJobs);
  }

  /** Marks a notification as read. */
  public markRead(notification: BackgroundJob<unknown>): Promise<void> {
    return this.notificationsHub.invoke(NotificationHubEvents.MarkJobRead, notification);
  }

  /** Marks a notification as read. */
  public markUnread(notification: BackgroundJob<unknown>): Promise<void> {
    return this.notificationsHub.invoke(NotificationHubEvents.MarkJobUnread, notification);
  }

  private makeHub(): void {
    this.notificationsHub = new HubConnectionBuilder()
      .withUrl(this.getUrl(), {
        accessTokenFactory: () => {
          let accessToken = this.store.selectSnapshot<string | null | undefined>(
            UserState.accessToken,
          );
          accessToken = !!accessToken ? accessToken : '';
          return accessToken;
        },
      })
      .build();

    this.notificationsHub.on(
      NotificationHubEvents.UpdateJobState,
      (job: BackgroundJob<unknown>) => {
        let replaced = false;
        for (let i = 0; i < this.notifications.length; i++) {
          const notification = this.notifications[i];
          if (notification.jobId === job.jobId) {
            this.notifications[i] = job;
            replaced = true;
            break;
          }
        }
        if (!replaced) {
          this.notifications.push(job);
        }

        this.notifications$.next(this.notifications);
      },
    );
  }

  private getUrl(): string {
    // if we are on staging, use the staging URL for the base
    const location = this.windowService.location();
    const isOnStaging = location?.origin === environment.stewardUiStagingUrl;
    const urlBase = isOnStaging ? environment.stewardApiStagingUrl : environment.stewardApiUrl;

    return `${urlBase}/hubs/notifications`;
  }
}
