import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { EMPTY, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { DateTime } from 'luxon';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { replace } from '@helpers/replace';
import { flatten, max } from 'lodash';
import { CommunityMessage } from '@models/community-message';
import { GuidLikeString } from '@models/extended-types';
import { IndividualNotificationManagementContract } from './individual-notification-management.contract';
import { PlayerNotification } from '@models/notifications.model';
import { MatPaginator } from '@angular/material/paginator';
import BigNumber from 'bignumber.js';
import { renderDelay } from '@helpers/rxjs';
import { DateValidators } from '@shared/validators/date-validators';

/** Interface used to track action monitor, form group, and edit state across rows. */
export interface FormGroupNotificationEntry {
  min: DateTime;
  formGroup: FormGroup;
  edit?: boolean;
  postMonitor: ActionMonitor;
  deleteMonitor: ActionMonitor;
  notification: PlayerNotification;
  isCommunityMessage: boolean;
  tooltip: string;
}

/**
 *  Notification management component.
 */
@Component({
  selector: 'individual-notification-management',
  templateUrl: './individual-notification-management.component.html',
  styleUrls: ['./individual-notification-management.component.scss'],
})
export class IndividualNotificationManagementComponent
  extends BaseComponent
  implements OnInit, AfterViewInit, OnChanges
{
  /** The individual notification management service. */
  @Input() public service: IndividualNotificationManagementContract;
  /** The selected xuid. */
  @Input() public selectedXuid: BigNumber;
  @ViewChild(MatPaginator) private paginator: MatPaginator;

  private readonly getNotifications$ = new Subject<void>();
  public readonly messageMaxLength: number = 512;

  public rawNotifications: PlayerNotification[];
  public notifications = new MatTableDataSource<FormGroupNotificationEntry>();

  public columnsToDisplay = ['message', 'metadata', 'actions'];

  public getMonitor: ActionMonitor = new ActionMonitor('GET');
  public allMonitors = [this.getMonitor];

  public min = DateTime.utc();

  /** Gets the game title */
  public get gameTitle(): GameTitle {
    return this.service.gameTitle;
  }

  /** Lifecycle hook */
  public ngAfterViewInit(): void {
    this.notifications.paginator = this.paginator;
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (!this.service) {
      throw new Error('No service provided for NotificationManagementBaseComponent');
    }

    this.getNotifications$
      .pipe(
        tap(() => (this.getMonitor = this.updateMonitors(this.getMonitor))),
        switchMap(() => {
          this.notifications.data = [];
          if (this.selectedXuid) {
            return this.service.getPlayerNotifications$(this.selectedXuid).pipe(
              this.getMonitor.monitorSingleFire(),
              catchError(() => {
                this.notifications.data = [];
                return EMPTY;
              }),
            );
          }

          return EMPTY;
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(returnList => {
        const controls: FormGroupNotificationEntry[] = returnList.map(entry => {
          return this.prepareNotifications(entry);
        });

        this.rawNotifications = returnList;
        this.allMonitors = flatten(controls.map(v => [v.postMonitor, v.deleteMonitor])).concat(
          this.getMonitor,
        );
        this.notifications.data = controls;
      });
  }

  /** Lifecycle hook */
  public ngOnChanges(): void {
    this.getNotifications$.next();
  }

  /** Refresh notification list */
  public refreshNotificationList(): void {
    this.getNotifications$.next();
  }

  /** Checks if notification is of Community Message type */
  public isCommunityMessage(entry: PlayerNotification): boolean {
    return entry?.notificationType === 'CommunityMessageNotification';
  }

  /** Retrieves notifications */
  public generateEditTooltip(entry: PlayerNotification): string {
    return this.isCommunityMessage(entry)
      ? 'Edit expire date'
      : `Editing is disabled for notifications of type: ${entry.notificationType}`;
  }

  /** Update notification selected */
  public updateNotificationEntry(entry: FormGroupNotificationEntry): void {
    const notificationId = entry.notification.notificationId as string;
    const entryMessage: CommunityMessage = {
      message: entry.formGroup.controls.message.value as string,
      startTimeUtc: entry.notification.sentDateUtc,
      expireTimeUtc: entry.formGroup.controls.expireDateUtc.value,
    };
    entry.postMonitor = this.updateMonitors(entry.postMonitor);
    this.service
      .postEditPlayerCommunityMessage$(this.selectedXuid, notificationId, entryMessage)
      .pipe(
        entry.postMonitor.monitorSingleFire(),
        renderDelay(),
        catchError(() => {
          return EMPTY;
        }),
      )
      .subscribe(() => this.replaceEntry(entry));
  }

  /** Remove notification selected */
  public removeNotificationEntry(entry: FormGroupNotificationEntry): void {
    const notificationId = entry.notification.notificationId as GuidLikeString;
    entry.deleteMonitor = this.updateMonitors(entry.deleteMonitor);
    this.service
      .deletePlayerCommunityMessage$(this.selectedXuid, notificationId)
      .pipe(
        entry.deleteMonitor.monitorSingleFire(),
        renderDelay(),
        catchError(() => {
          return EMPTY;
        }),
      )
      .subscribe(() => this.deleteEntry(entry));
  }

  /** Reverts an entry from edit state. */
  public revertEntryEdit(entry: FormGroupNotificationEntry): void {
    entry.edit = false;
    const rawEntry = this.rawNotifications.find(
      v => v.notificationId == entry.notification.notificationId,
    );

    entry.formGroup.controls.expireDateUtc.setValue(rawEntry.expirationDateUtc);
    entry.formGroup.controls.message.setValue(rawEntry.message);
    entry.postMonitor = new ActionMonitor('Edit Notification');
    entry.deleteMonitor = new ActionMonitor('Delete Notification');
  }

  /** Puts entry in editable state. */
  public editEntry(entry: FormGroupNotificationEntry): void {
    entry.edit = true;
  }

  private prepareNotifications(playerNotification: PlayerNotification): FormGroupNotificationEntry {
    const min = max([DateTime.utc(), playerNotification.sentDateUtc]);
    const formControls = {
      message: new FormControl(playerNotification.message, [
        Validators.required,
        Validators.maxLength(this.messageMaxLength),
      ]),
      expireDateUtc: new FormControl(playerNotification.expirationDateUtc, [
        Validators.required,
        DateValidators.isAfter(min),
      ]),
    };

    const newControls = <FormGroupNotificationEntry>{
      min: min,
      formGroup: new FormGroup(formControls),
      formControls: formControls,
      postMonitor: new ActionMonitor('Edit Notification'),
      deleteMonitor: new ActionMonitor('Delete Notification'),
      notification: playerNotification,
      isCommunityMessage: this.isCommunityMessage(playerNotification),
      tooltip: this.generateEditTooltip(playerNotification),
    };

    return newControls;
  }

  /** Recreates the given action monitor, replacing it in the allMonitors list. */
  private updateMonitors(oldMonitor: ActionMonitor): ActionMonitor {
    oldMonitor.dispose();
    const newMonitor = new ActionMonitor(oldMonitor.label);
    this.allMonitors = replace(this.allMonitors, oldMonitor, newMonitor);
    return newMonitor;
  }

  private deleteEntry(entry: FormGroupNotificationEntry): void {
    const index = this.notifications.data.indexOf(entry);
    this.notifications.data.splice(index, 1);
    this.rawNotifications.splice(index, 1);
    entry.deleteMonitor.dispose();
    entry.postMonitor.dispose();
    this.notifications._updateChangeSubscription();
  }

  private replaceEntry(entry: FormGroupNotificationEntry): void {
    const newEntry: PlayerNotification = {
      notificationId: entry.notification.notificationId,
      message: entry.formGroup.controls.message.value,
      isRead: entry.notification.isRead,
      notificationType: entry.notification.notificationType,
      sentDateUtc: entry.notification.sentDateUtc,
      expirationDateUtc: entry.formGroup.controls.expireDateUtc.value,
    };

    entry.edit = false;
    const index = this.notifications.data.indexOf(entry);
    this.rawNotifications.splice(index, 1, newEntry);
    this.notifications._updateChangeSubscription();
  }
}
