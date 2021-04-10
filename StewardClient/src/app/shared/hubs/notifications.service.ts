import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BackgroundJob } from '@models/background-job';
import { Store } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { Subject } from 'rxjs';

/** A service providing Notifications Hub connectivity. */
@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  public notifications$: Subject<BackgroundJob<unknown>[]> = new Subject<
    BackgroundJob<unknown>[]
  >();
  public notifications: BackgroundJob<unknown>[] = [];

  public isReady = false;
  private notificationsHub: HubConnection;

  constructor(private readonly store: Store) {
    this.notificationsHub = new HubConnectionBuilder()
      .withUrl(`${environment.stewardApiUrl}/hubs/notifications`, {
        accessTokenFactory: () => {
          let accessToken = this.store.selectSnapshot<string | null | undefined>(
            UserState.accessToken,
          );
          accessToken = !!accessToken ? accessToken : '';
          return accessToken;
        },
      })
      .build();

    this.notificationsHub.on('JobChange', (job: BackgroundJob<unknown>) => {
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
    });
    this.initialize();
  }

  /** Initialization method. */
  public async initialize(): Promise<void> {
    try {
      await this.notificationsHub.start();
      this.isReady = true;
    } catch (error) {
      // eslint-disable-next-line no-debugger
      debugger;
    }
  }

  /** Syncs notifications with the server. */
  public async sync(): Promise<void> {
    this.notifications = [];
    this.notifications$.next(this.notifications);
    await this.notificationsHub.invoke('SyncAll');
  }

  /** Marks a notification as read. */
  public markRead(notification: BackgroundJob<unknown>): Promise<void> {
    return this.notificationsHub.invoke('MarkRead', notification);
  }

  /** Marks a notification as read. */
  public markUnread(notification: BackgroundJob<unknown>): Promise<void> {
    return this.notificationsHub.invoke('MarkUnread', notification);
  }
}
