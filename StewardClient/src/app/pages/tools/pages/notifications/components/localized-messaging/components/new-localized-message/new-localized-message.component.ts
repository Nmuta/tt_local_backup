import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalizedMessage } from '@models/community-message';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { DateTime } from 'luxon';
import { DeviceType, NotificationType } from '@models/enums';
import { DatetimeRangePickerFormValue } from '@components/date-time-pickers/datetime-range-picker/datetime-range-picker.component';
import { SelectLocalizedStringContract } from '@components/localization/select-localized-string/select-localized-string.component';

/** Outputs a new localized message. */
@Component({
  selector: 'new-localized-message',
  templateUrl: './new-localized-message.component.html',
  styleUrls: ['./new-localized-message.component.scss'],
})
export class NewLocalizedMessageComponent implements OnChanges {
  private static readonly UTC_NOW = DateTime.utc();
  @Input() public pendingLocalizedMessage: LocalizedMessage;
  @Input() public allowDeviceTypeFilter: boolean;
  @Input() public service: SelectLocalizedStringContract;
  @Input() public lockStartTime: boolean = false;
  @Output() public emitNewLocalizedMessage = new EventEmitter<LocalizedMessage>();

  private dateRange: DatetimeRangePickerFormValue = {
    start: NewLocalizedMessageComponent.UTC_NOW.toUTC(),
    end: NewLocalizedMessageComponent.UTC_NOW.plus({ hour: 1 }).toUTC(),
  };  

  public min = DateTime.utc().minus({ days: 1 });

  public readonly messageMaxLength: number = 512;

  public arrowIcon = faArrowCircleRight;

  public deviceTypes: string[] = Object.values(DeviceType);

  public notificationTypes: string[] = Object.values(NotificationType);

  public formControls = {
    localizedMessageId: new FormControl('', [
      Validators.required,
      Validators.maxLength(this.messageMaxLength),
    ]),
    dateRange: new FormControl(this.dateRange, [Validators.required]),
    deviceType: new FormControl(DeviceType.All, [Validators.required]),
    notificationType: new FormControl(NotificationType.CommunityMessage, [Validators.required])
  };

  public formGroup: FormGroup = new FormGroup(this.formControls);

  /** Lifecycle hook. */
  public ngOnChanges(): void {
    if (!!this.pendingLocalizedMessage) {
      this.formControls.localizedMessageId.setValue(this.pendingLocalizedMessage.localizedMessageId);
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

      console.log(this.formControls)
    }
    
  }

  /** Create message */
  public createMessage(): void {
    const message = this.formControls.localizedMessageId.value;
    const range = this.formControls.dateRange.value as DatetimeRangePickerFormValue;
    const startTime = range?.start;
    const endTime = range?.end;
    const notificationType = this.formControls.notificationType.value ?? null;
    const deviceType = this.allowDeviceTypeFilter ? this.formControls.deviceType.value : null;

    //console.log('new-localized-message::createMessage')
    //console.log(message)

    this.emitNewLocalizedMessage.emit({
      localizedMessageId: message,
      startTimeUtc: startTime,
      expireTimeUtc: endTime,
      deviceType: deviceType,
      notificationType: notificationType,
    } as LocalizedMessage);
  }
}
