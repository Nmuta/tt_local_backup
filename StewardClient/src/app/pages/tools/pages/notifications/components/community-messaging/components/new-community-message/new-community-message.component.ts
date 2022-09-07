import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommunityMessage } from '@models/community-message';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { DateTime } from 'luxon';
import { DeviceType } from '@models/enums';
import { DatetimeRangePickerFormValue } from '@components/date-time-pickers/datetime-range-picker/datetime-range-picker.component';

/** Outputs a new community message. */
@Component({
  selector: 'new-community-message',
  templateUrl: './new-community-message.component.html',
  styleUrls: ['./new-community-message.component.scss'],
})
export class NewCommunityMessageComponent implements OnInit {
  private static readonly UTC_NOW = DateTime.utc();
  @Input() public pendingCommunityMessage: CommunityMessage;
  @Input() public allowDeviceTypeFilter: boolean;
  @Input() public lockStartTime: boolean = false;
  @Output() public emitNewCommunityMessage = new EventEmitter<CommunityMessage>();

  private dateRange: DatetimeRangePickerFormValue = {
    start: NewCommunityMessageComponent.UTC_NOW.toUTC(),
    end: NewCommunityMessageComponent.UTC_NOW.plus({ hour: 1 }).toUTC(),
  };

  public min = DateTime.utc().minus({ days: 1 });

  public readonly messageMaxLength: number = 512;

  public arrowIcon = faArrowCircleRight;

  public deviceTypes: string[] = Object.values(DeviceType);

  public formControls = {
    message: new FormControl('', [
      Validators.required,
      Validators.maxLength(this.messageMaxLength),
    ]),
    dateRange: new FormControl(this.dateRange, [Validators.required]),
    deviceType: new FormControl(DeviceType.All, [Validators.required]),
  };

  public newCommunityMessageForm: FormGroup = new FormGroup(this.formControls);

  constructor(private readonly formBuilder: FormBuilder) {}

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (!!this.pendingCommunityMessage) {
      this.formControls.message.setValue(this.pendingCommunityMessage.message);
      this.formControls.dateRange.setValue({
        start: this.pendingCommunityMessage.startTimeUtc,
        end: this.pendingCommunityMessage.expireTimeUtc,
      });
      this.formControls.deviceType.setValue(
        this.pendingCommunityMessage.deviceType ?? DeviceType.All,
      );
    }
  }

  /** Create message */
  public createMessage(): void {
    const message = this.formControls.message.value;
    const range = this.formControls.dateRange.value as DatetimeRangePickerFormValue;
    const startTime = range?.start;
    const endTime = range?.end;
    const deviceType = this.allowDeviceTypeFilter ? this.formControls.deviceType.value : null;

    this.emitNewCommunityMessage.emit({
      message: message,
      startTimeUtc: startTime,
      expireTimeUtc: endTime,
      deviceType: deviceType,
    } as CommunityMessage);
  }
}
