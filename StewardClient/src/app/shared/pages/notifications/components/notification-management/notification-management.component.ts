import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { DeviceType, GameTitle } from '@models/enums';
import { EMPTY, Subject } from 'rxjs';
import { catchError, delay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { DateValidators } from '@shared/validators/date-validators';
import { DateTime } from 'luxon';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { replace } from '@helpers/replace';
import { flatten } from 'lodash';
import { LspGroup } from '@models/lsp-group';
import { CommunityMessage } from '@models/community-message';
import { GuidLikeString } from '@models/extended-types';
import { NotificationManagementService } from './notification-management.service';
import { GroupNotification, GroupNotifications } from '@models/notifications.model';
import { toDateTime } from '@helpers/luxon';
import { MatPaginator } from '@angular/material/paginator';

/** Interface used to track action monitor, form group, and edit state across rows. */
export interface FormGroupNotificationEntry {
  formGroup: FormGroup;
  edit?: boolean;
  postMonitor: ActionMonitor;
  deleteMonitor: ActionMonitor;
  notification: GroupNotification;
  isCommunityMessage: boolean;
  tooltip: string;
}

/**
 *  Notification management component.
 */
@Component({
  selector: 'notification-management',
  templateUrl: './notification-management.component.html',
  styleUrls: ['./notification-management.component.scss'],
})
export class NotificationManagementComponent
  extends BaseComponent
  implements OnInit, AfterViewInit, OnChanges {
  @Input() public service: NotificationManagementService;
  @Input() public selectedLspGroup: LspGroup;
  /** True for player lookup, false for LSP group lookup.  */
  @Input() public isUsingPlayerIdentities: boolean;
  @ViewChild(MatPaginator) private paginator: MatPaginator;

  private readonly getNotifications$ = new Subject<GroupNotifications>();
  private readonly noExpireDefaultTime = DateTime.local(9999, 12, 31);
  public readonly messageMaxLength: number = 512;

  public deviceTypes: string[] = Object.values(DeviceType);
  public rawNotifications: GroupNotifications;
  public notifications = new MatTableDataSource<FormGroupNotificationEntry>();

  public columnsToDisplay = ['message', 'metadata', 'actions'];

  public getMonitor: ActionMonitor = new ActionMonitor('GET');
  public allMonitors = [this.getMonitor];

  /** Gets the game title */
  public get gameTitle(): GameTitle {
    return this.service.getGameTitle();
  }

  public dateTimeFutureFilter = (input: DateTime | null): boolean => {
    const day = input || DateTime.local().startOf('day');
    return day > DateTime.local().startOf('day');
  };

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
          if (this.selectedLspGroup?.id) {
            return this.service.getGroupNotifications$(this.selectedLspGroup?.id).pipe(
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
  public isCommunityMessage(entry: GroupNotification): boolean {
    return entry.notificationType === 'CommunityMessageNotification';
  }

  /** Retrieves notifications */
  public generateEditTooltip(entry: GroupNotification): string {
    return this.isCommunityMessage(entry)
      ? 'Edit expire date'
      : `Editing is disabled for notifications of type: ${entry.notificationType}`;
  }

  /** Update notification selected */
  public updateNotificationEntry(entry: FormGroupNotificationEntry): void {
    const notificationId = entry.notification.notificationId as string;
    const expireTime = toDateTime(entry.formGroup.controls.expireDateUtc.value);
    const expireTimeDuration = expireTime.diff(DateTime.local());
    const entryMessage: CommunityMessage = {
      message: entry.formGroup.controls.message.value as string,
      deviceType: entry.formGroup.controls.deviceType.value as string,
      duration: expireTimeDuration,
      expiryDate: expireTime,
    };
    entry.postMonitor = this.updateMonitors(entry.postMonitor);
    this.service
      .postEditLspGroupCommunityMessage$(notificationId, entryMessage)
      .pipe(
        entry.postMonitor.monitorSingleFire(),
        delay(0), // 1 frame delay to allow action monitors to update.
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
      .deleteLspGroupCommunityMessage$(notificationId)
      .pipe(
        entry.deleteMonitor.monitorSingleFire(),
        delay(0), // 1 frame delay to allow action monitors to update.
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
    entry.formGroup.controls.expireDateUtc.setValue(rawEntry.expirationDateUtc.toISO());
    entry.formGroup.controls.message.setValue(rawEntry.message);
    entry.formGroup.controls.deviceType.setValue(rawEntry.deviceType);
    entry.postMonitor = new ActionMonitor('Edit Notification');
    entry.deleteMonitor = new ActionMonitor('Delete Notification');
  }

  /** Puts entry in editable state. */
  public editEntry(entry: FormGroupNotificationEntry): void {
    entry.edit = true;
  }

  private prepareNotifications(groupNotification: GroupNotification): FormGroupNotificationEntry {
    const formControls = {
      message: new FormControl(groupNotification.message, [
        Validators.required,
        Validators.maxLength(this.messageMaxLength),
      ]),
      deviceType: new FormControl(groupNotification.deviceType),
      expireDateUtc: new FormControl(groupNotification.expirationDateUtc.toISO(), [
        Validators.required,
        DateValidators.isAfter(DateTime.local().startOf('day')),
      ]),
    };
    const newControls = <FormGroupNotificationEntry>{
      formGroup: new FormGroup(formControls),
      formControls: formControls,
      postMonitor: new ActionMonitor('Edit Notification'),
      deleteMonitor: new ActionMonitor('Delete Notification'),
      notification: groupNotification,
      isCommunityMessage: this.isCommunityMessage(groupNotification),
      tooltip: this.generateEditTooltip(groupNotification),
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
    const newEntry: GroupNotification = {
      notificationId: entry.notification.notificationId,
      groupId: this.selectedLspGroup.id,
      message: entry.formGroup.controls.message.value,
      hasDeviceType: false,
      deviceType: entry.formGroup.controls.deviceType.value,
      notificationType: entry.notification.notificationType,
      sentDateUtc: entry.notification.sentDateUtc,
      expirationDateUtc: entry.formGroup.controls.expireDateUtc.value ?? this.noExpireDefaultTime,
    };

    entry.edit = false;
    const index = this.notifications.data.indexOf(entry);
    this.rawNotifications.splice(index, 1, newEntry);
    this.notifications._updateChangeSubscription();
  }
}
