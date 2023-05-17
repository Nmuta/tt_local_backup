import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { DateTime } from 'luxon';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { chain, max } from 'lodash';
import { LocalizedPlayerNotification } from '@models/notifications.model';
import { MatPaginator } from '@angular/material/paginator';
import BigNumber from 'bignumber.js';
import { DateValidators } from '@shared/validators/date-validators';
import { renderDelay } from '@helpers/rxjs';
import { GuidLikeString } from '@models/extended-types';
import { LocalizedMessage } from '@models/community-message';
import { SelectLocalizedStringContract } from '@components/localization/select-localized-string/select-localized-string.component';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';

/** Service contract for managing localized messages for individuals. */
export interface LocalizedIndividualMessagingManagementContract {
  gameTitle: GameTitle;
  selectLocalizedStringService: SelectLocalizedStringContract;
  postEditPlayerCommunityMessage$(
    lspGroupId: BigNumber,
    notificationId: string,
    localizedMessage: LocalizedMessage,
  ): Observable<void>;
  getPlayerNotifications$(xuid: BigNumber): Observable<LocalizedPlayerNotification[]>;
  deletePlayerCommunityMessage$(xuid: BigNumber, notificationId: string): Observable<void>;
}

/** Interface used to track action monitor, form group, and edit state across rows. */
export interface FormGroupNotificationEntry {
  min: DateTime;
  formGroup: FormGroup;
  edit?: boolean;
  postMonitor: ActionMonitor;
  deleteMonitor: ActionMonitor;
  notification: LocalizedPlayerNotification;
  isEditable: boolean;
  tooltip: string;
}

/**
 *  Notification management component.
 */
@Component({
  selector: 'localized-individual-notification-management',
  templateUrl: './localized-individual-notification-management.component.html',
  styleUrls: ['./localized-individual-notification-management.component.scss'],
})
export class LocalizedIndividualNotificationManagementComponent
  extends BaseComponent
  implements OnInit, AfterViewInit, OnChanges
{
  /** The individual notification management service. */
  @Input() public service: LocalizedIndividualMessagingManagementContract;
  /** The selected xuid, determines which inbox to display. */
  @Input() public selectedXuid: BigNumber;
  @ViewChild(MatPaginator) private paginator: MatPaginator;

  private readonly getNotifications$ = new Subject<void>();
  public readonly messageMaxLength: number = 512;

  public rawNotifications: LocalizedPlayerNotification[];
  public notifications = new MatTableDataSource<FormGroupNotificationEntry>();

  public columnsToDisplay = ['title', 'message', 'metadata', 'actions'];

  public getMonitor: ActionMonitor = new ActionMonitor('GET');
  public allMonitors = [this.getMonitor];

  public min = DateTime.utc();

  public readonly permAttribute = PermAttributeName.MessagePlayer;

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

  /** Checks if PlayerNotification is of an editable type */
  public isEditable(entry: LocalizedPlayerNotification): boolean {
    switch (entry?.notificationType) {
      case 'CommunityMessageNotificationV2':
      case 'PatchNotesMessageNotification':
        return true;
      default:
        return false;
    }
  }

  /** Generates Edit Tooltip */
  public generateEditTooltip(entry: LocalizedPlayerNotification): string {
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
      startTimeUtc: entry.notification.sentDateUtc,
      expireTimeUtc: entry.formGroup.controls.expireDateUtc.value,
      notificationType: null,
    };
    entry.postMonitor = entry.postMonitor.repeat();
    this.service
      .postEditPlayerCommunityMessage$(this.selectedXuid, notificationId, entryMessage)
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
      .deletePlayerCommunityMessage$(this.selectedXuid, notificationId)
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
    entry.postMonitor = new ActionMonitor('Edit Notification');
    entry.deleteMonitor = new ActionMonitor('Delete Notification');
  }

  /** Puts entry in editable state. */
  public editEntry(entry: FormGroupNotificationEntry): void {
    entry.edit = true;
  }

  private prepareNotifications(
    playerNotification: LocalizedPlayerNotification,
  ): FormGroupNotificationEntry {
    const min = max([DateTime.utc(), playerNotification.sentDateUtc]);
    const formControls = {
      localizedTitleInfo: new FormControl({ id: '', englishText: playerNotification.title }), //Replace with line below once we have working title editing
      //localizedTitleInfo: new FormControl({}, [Validators.required]),
      localizedMessageInfo: new FormControl({}, [Validators.required]),
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
      isEditable: this.isEditable(playerNotification),
      tooltip: this.generateEditTooltip(playerNotification),
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
    const newEntry: LocalizedPlayerNotification = {
      notificationId: entry.notification.notificationId,
      title: entry.formGroup.controls.localizedTitleInfo.value?.englishText,
      message: entry.formGroup.controls.localizedMessageInfo.value?.englishText,
      isRead: entry.notification.isRead,
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
