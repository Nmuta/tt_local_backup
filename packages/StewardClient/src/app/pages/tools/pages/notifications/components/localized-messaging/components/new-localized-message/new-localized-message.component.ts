import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { LocalizedMessage } from '@models/community-message';
import { DateTime } from 'luxon';
import { DeviceType, GameTitle, NotificationType } from '@models/enums';
import { DatetimeRangePickerFormValue } from '@components/date-time-pickers/datetime-range-picker/datetime-range-picker.component';
import { SelectLocalizedStringContract } from '@components/localization/select-localized-string/select-localized-string.component';
import { values } from 'lodash';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { BetterSimpleChanges } from '@helpers/simple-changes';

export type LocalizedMessageWithEnglishPreview = LocalizedMessage & {
  englishMessageText: string;
  englishTitleText: string;
};

/** Outputs a new localized message. */
@Component({
  selector: 'new-localized-message',
  templateUrl: './new-localized-message.component.html',
  styleUrls: ['./new-localized-message.component.scss'],
})
export class NewLocalizedMessageComponent implements OnChanges {
  private static readonly UTC_NOW = DateTime.utc();
  /** REVIEW-COMMENT: Pending localized message. */
  @Input() public pendingLocalizedMessage: LocalizedMessageWithEnglishPreview;
  /** REVIEW-COMMENT: Allow device type filter. */
  @Input() public allowDeviceTypeFilter: boolean;
  /** REVIEW-COMMENT: The localized string service. */
  @Input() public service: SelectLocalizedStringContract;
  /** REVIEW-COMMENT: Is start time lock. */
  @Input() public lockStartTime: boolean = false;
  /** The game title. */
  @Input() public gameTitle: GameTitle;
  /** True if component is using player identities. */
  @Input() isUsingPlayerIdentities: boolean = true;
  /** REVIEW-COMMENT: Event when new localized message is created. */
  @Output() public emitNewLocalizedMessage = new EventEmitter<LocalizedMessageWithEnglishPreview>();

  private dateRange: DatetimeRangePickerFormValue = {
    start: NewLocalizedMessageComponent.UTC_NOW.toUTC(),
    end: NewLocalizedMessageComponent.UTC_NOW.plus({ hour: 1 }).toUTC(),
  };

  public min = DateTime.utc().minus({ days: 1 });

  public readonly messageMaxLength: number = 512;

  public deviceTypes: string[] = values(DeviceType);

  public notificationTypes: string[] = values(NotificationType);

  public formControls = {
    localizedTitleInfo: new UntypedFormControl({}, [Validators.required]),
    localizedMessageInfo: new UntypedFormControl({}, [Validators.required]),
    dateRange: new UntypedFormControl(this.dateRange, [Validators.required]),
    deviceType: new UntypedFormControl(DeviceType.All, [Validators.required]),
    notificationType: new UntypedFormControl(NotificationType.CommunityMessage, [Validators.required]),
  };

  public formGroup: UntypedFormGroup = new UntypedFormGroup(this.formControls);

  public activePermAttribute = PermAttributeName.MessagePlayer;

  /** Lifecycle hook. */
  public ngOnChanges(changes: BetterSimpleChanges<NewLocalizedMessageComponent>): void {
    if (changes.isUsingPlayerIdentities) {
      this.activePermAttribute = this.isUsingPlayerIdentities
        ? PermAttributeName.MessagePlayer
        : PermAttributeName.MessageGroup;
    }

    if (!!this.pendingLocalizedMessage) {
      this.formControls.localizedTitleInfo.setValue({
        id: this.pendingLocalizedMessage.localizedTitleId,
        englishText: this.pendingLocalizedMessage.englishTitleText,
      });
      this.formControls.localizedMessageInfo.setValue({
        id: this.pendingLocalizedMessage.localizedMessageId,
        englishText: this.pendingLocalizedMessage.englishMessageText,
      });
      this.formControls.dateRange.setValue({
        start: this.pendingLocalizedMessage.startTimeUtc,
        end: this.pendingLocalizedMessage.expireTimeUtc,
      });
      this.formControls.deviceType.setValue(
        this.pendingLocalizedMessage.deviceType ?? DeviceType.All,
      );
      this.formControls.notificationType.setValue(
        this.pendingLocalizedMessage.notificationType ?? NotificationType.CommunityMessage,
      );
    }
  }

  /** Create message */
  public createMessage(): void {
    const title = this.formControls.localizedTitleInfo.value.id;
    const englishTitleText = this.formControls.localizedTitleInfo.value.englishText;
    const message = this.formControls.localizedMessageInfo.value.id;
    const englishMessageText = this.formControls.localizedMessageInfo.value.englishText;
    const range = this.formControls.dateRange.value as DatetimeRangePickerFormValue;
    const startTime = range?.start;
    const endTime = range?.end;
    const notificationType = this.formControls.notificationType.value ?? null;
    const deviceType = this.allowDeviceTypeFilter ? this.formControls.deviceType.value : null;

    this.emitNewLocalizedMessage.emit({
      localizedTitleId: title,
      englishTitleText: englishTitleText,
      localizedMessageId: message,
      englishMessageText: englishMessageText,
      startTimeUtc: startTime,
      expireTimeUtc: endTime,
      deviceType: deviceType,
      notificationType: notificationType,
    } as LocalizedMessageWithEnglishPreview);
  }
}
