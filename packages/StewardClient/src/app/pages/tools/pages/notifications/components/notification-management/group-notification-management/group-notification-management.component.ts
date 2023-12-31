import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { DeviceType, GameTitle } from '@models/enums';
import { EMPTY, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { DateTime } from 'luxon';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { flatten, max } from 'lodash';
import { LspGroup } from '@models/lsp-group';
import { CommunityMessage } from '@models/community-message';
import { GuidLikeString } from '@models/extended-types';
import { GroupNotificationManagementContract } from './group-notification-management.contract';
import { GroupNotification } from '@models/notifications.model';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { renderDelay } from '@helpers/rxjs';
import { DateValidators } from '@shared/validators/date-validators';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';

/** Interface used to track action monitor, form group, and edit state across rows. */
export interface FormGroupNotificationEntry {
  min: DateTime;
  formGroup: UntypedFormGroup;
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
  selector: 'group-notification-management',
  templateUrl: './group-notification-management.component.html',
  styleUrls: ['./group-notification-management.component.scss'],
})
export class GroupNotificationManagementComponent
  extends BaseComponent
  implements OnInit, AfterViewInit, OnChanges
{
  /** The group notification service. */
  @Input() public service: GroupNotificationManagementContract;
  /** The selected LSP group. */
  @Input() public selectedLspGroup: LspGroup;
  @ViewChild(MatPaginator) private paginator: MatPaginator;

  private readonly getNotifications$ = new Subject<void>();
  public readonly messageMaxLength: number = 512;

  public deviceTypes: string[] = Object.values(DeviceType);
  public rawNotifications: GroupNotification[];
  public notifications = new MatTableDataSource<FormGroupNotificationEntry>();

  public columnsToDisplay = ['message', 'metadata', 'actions'];

  public getMonitor: ActionMonitor = new ActionMonitor('GET');
  public allMonitors = [this.getMonitor];

  public min = DateTime.utc();

  public readonly permAttribute = PermAttributeName.MessageGroup;

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
        tap(() => (this.getMonitor = this.getMonitor.repeat())),
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
    return entry?.notificationType === 'CommunityMessageNotification';
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
    const entryMessage: CommunityMessage = {
      message: entry.formGroup.controls.message.value as string,
      deviceType: entry.formGroup.controls.deviceType.value as string,
      startTimeUtc: entry.notification.sentDateUtc,
      expireTimeUtc: entry.formGroup.controls.expireDateUtc.value,
    };
    entry.postMonitor = entry.postMonitor.repeat();
    this.service
      .postEditLspGroupCommunityMessage$(this.selectedLspGroup.id, notificationId, entryMessage)
      .pipe(
        entry.postMonitor.monitorSingleFire(),
        renderDelay(),
        catchError(() => {
          return EMPTY;
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => this.replaceEntry(entry));
  }

  /** Remove notification selected */
  public removeNotificationEntry(entry: FormGroupNotificationEntry): void {
    const notificationId = entry.notification.notificationId as GuidLikeString;
    entry.deleteMonitor = entry.deleteMonitor.repeat();
    this.service
      .deleteLspGroupCommunityMessage$(this.selectedLspGroup.id, notificationId)
      .pipe(
        entry.deleteMonitor.monitorSingleFire(),
        renderDelay(),
        catchError(() => {
          return EMPTY;
        }),
        takeUntil(this.onDestroy$),
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
    entry.formGroup.controls.deviceType.setValue(rawEntry.deviceType);
    entry.postMonitor = new ActionMonitor('Edit Notification');
    entry.deleteMonitor = new ActionMonitor('Delete Notification');
  }

  /** Puts entry in editable state. */
  public editEntry(entry: FormGroupNotificationEntry): void {
    entry.edit = true;
  }

  private prepareNotifications(groupNotification: GroupNotification): FormGroupNotificationEntry {
    const min = max([DateTime.utc(), groupNotification.sentDateUtc]);
    const formControls = {
      message: new UntypedFormControl(groupNotification.message, [
        Validators.required,
        Validators.maxLength(this.messageMaxLength),
      ]),
      deviceType: new UntypedFormControl(groupNotification.deviceType),
      expireDateUtc: new UntypedFormControl(groupNotification.expirationDateUtc, [
        Validators.required,
        DateValidators.isAfter(min),
      ]),
    };
    const newControls = <FormGroupNotificationEntry>{
      min: min,
      formGroup: new UntypedFormGroup(formControls),
      formControls: formControls,
      postMonitor: new ActionMonitor('Edit Notification'),
      deleteMonitor: new ActionMonitor('Delete Notification'),
      notification: groupNotification,
      isCommunityMessage: this.isCommunityMessage(groupNotification),
      tooltip: this.generateEditTooltip(groupNotification),
    };

    return newControls;
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
      expirationDateUtc: entry.formGroup.controls.expireDateUtc.value,
    };

    entry.edit = false;
    const index = this.notifications.data.indexOf(entry);
    this.rawNotifications.splice(index, 1, newEntry);
    this.notifications._updateChangeSubscription();
  }
}
