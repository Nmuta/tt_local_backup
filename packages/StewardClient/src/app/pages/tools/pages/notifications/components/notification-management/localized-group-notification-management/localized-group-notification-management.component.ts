import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { DeviceType, GameTitle } from '@models/enums';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { DateTime } from 'luxon';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { chain, max } from 'lodash';
import { LspGroup } from '@models/lsp-group';
import { GuidLikeString } from '@models/extended-types';
import { LocalizedGroupNotification } from '@models/notifications.model';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { renderDelay } from '@helpers/rxjs';
import { DateValidators } from '@shared/validators/date-validators';
import BigNumber from 'bignumber.js';
import { LocalizedMessage } from '@models/community-message';
import { SelectLocalizedStringContract } from '@components/localization/select-localized-string/select-localized-string.component';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';

/** Service contract for managing localized messages for groups. */
export interface LocalizedGroupMessagingManagementContract {
  gameTitle: GameTitle;
  selectLocalizedStringService: SelectLocalizedStringContract;
  getGroupNotifications$(lspGroupId: BigNumber): Observable<LocalizedGroupNotification[]>;
  postEditLspGroupCommunityMessage$(
    lspGroupId: BigNumber,
    notificationId: string,
    localizedMessage: LocalizedMessage,
  ): Observable<void>;
  deleteLspGroupCommunityMessage$(lspGroupId: BigNumber, notificationId: string): Observable<void>;
}

/** Interface used to track action monitor, form group, and edit state across rows. */
export interface FormGroupNotificationEntry {
  min: DateTime;
  formGroup: UntypedFormGroup;
  edit?: boolean;
  postMonitor: ActionMonitor;
  deleteMonitor: ActionMonitor;
  notification: LocalizedGroupNotification;
  isEditable: boolean;
  tooltip: string;
}

/**
 *  Notification management component.
 */
@Component({
  selector: 'localized-group-notification-management',
  templateUrl: './localized-group-notification-management.component.html',
  styleUrls: ['./localized-group-notification-management.component.scss'],
})
export class LocalizedGroupNotificationManagementComponent
  extends BaseComponent
  implements OnInit, AfterViewInit, OnChanges
{
  /** The group notification service. */
  @Input() public service: LocalizedGroupMessagingManagementContract;
  /** The selected LSP group, determines which inbox to display. */
  @Input() public selectedLspGroup: LspGroup;
  @ViewChild(MatPaginator) private paginator: MatPaginator;

  private readonly getNotifications$ = new Subject<void>();
  public readonly messageMaxLength: number = 512;

  public deviceTypes: string[] = Object.values(DeviceType);
  public rawNotifications: LocalizedGroupNotification[];
  public notifications = new MatTableDataSource<FormGroupNotificationEntry>();

  public columnsToDisplay = ['title', 'message', 'metadata', 'actions'];

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
        this.allMonitors = chain(controls)
          .map(v => [v.postMonitor, v.deleteMonitor])
          .flatten()
          .concat([this.getMonitor])
          .value();
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

  /** Checks if GroupNotification is of an editable type */
  public isEditable(entry: LocalizedGroupNotification): boolean {
    switch (entry?.notificationType) {
      case 'CommunityMessageNotificationV2':
      case 'PatchNotesMessageNotification':
        return true;
      default:
        return false;
    }
  }

  /** Generates Edit Tooltip */
  public generateEditTooltip(entry: LocalizedGroupNotification): string {
    if (this.isEditable(entry)) {
      return 'Edit message properties';
    } else {
      return `Editing is disabled for notifications of type: ${entry.notificationType}`;
    }
  }

  /** Update notification selected */
  public updateNotificationEntry(entry: FormGroupNotificationEntry): void {
    const notificationId = entry.notification.notificationId as string;
    const entryMessage: LocalizedMessage = {
      localizedTitleId: entry.formGroup.controls.localizedTitleInfo.value?.id as string,
      localizedMessageId: entry.formGroup.controls.localizedMessageInfo.value?.id as string,
      deviceType: entry.formGroup.controls.deviceType.value as string,
      startTimeUtc: entry.notification.sentDateUtc,
      expireTimeUtc: entry.formGroup.controls.expireDateUtc.value,
      notificationType: null,
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
    entry.formGroup.controls.localizedTitleInfo.setValue(null);
    entry.formGroup.controls.localizedMessageInfo.setValue(null);
    entry.formGroup.controls.deviceType.setValue(rawEntry.deviceType);
    entry.postMonitor = new ActionMonitor('Edit Notification');
    entry.deleteMonitor = new ActionMonitor('Delete Notification');
  }

  /** Puts entry in editable state. */
  public editEntry(entry: FormGroupNotificationEntry): void {
    entry.edit = true;
  }

  private prepareNotifications(
    groupNotification: LocalizedGroupNotification,
  ): FormGroupNotificationEntry {
    const min = max([DateTime.utc(), groupNotification.sentDateUtc]);
    const formControls = {
      localizedTitleInfo: new UntypedFormControl({}, [Validators.required]),
      localizedMessageInfo: new UntypedFormControl({}, [Validators.required]),
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
      isEditable: this.isEditable(groupNotification),
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
    const newEntry: LocalizedGroupNotification = {
      notificationId: entry.notification.notificationId,
      groupId: this.selectedLspGroup.id,
      title: entry.formGroup.controls.localizedTitleInfo.value?.englishText,
      message: entry.formGroup.controls.localizedMessageInfo.value?.englishText,
      hasDeviceType: false,
      deviceType: entry.formGroup.controls.deviceType.value,
      notificationType: entry.notification.notificationType,
      sentDateUtc: entry.notification.sentDateUtc,
      expirationDateUtc: entry.formGroup.controls.expireDateUtc.value,
    };

    entry.edit = false;
    const index = this.notifications.data.indexOf(entry);
    this.rawNotifications.splice(index, 1, newEntry);
    this.notifications.data[index].notification = newEntry;
    this.notifications._updateChangeSubscription();
  }
}
