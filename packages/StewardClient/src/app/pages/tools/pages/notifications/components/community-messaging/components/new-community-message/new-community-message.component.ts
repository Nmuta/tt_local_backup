import { Component, Output, EventEmitter, Input, OnInit, OnChanges } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { CommunityMessage } from '@models/community-message';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { DateTime } from 'luxon';
import { DeviceType, GameTitle } from '@models/enums';
import { DatetimeRangePickerFormValue } from '@components/date-time-pickers/datetime-range-picker/datetime-range-picker.component';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { BetterSimpleChanges } from '@helpers/simple-changes';

/** Outputs a new community message. */
@Component({
  selector: 'new-community-message',
  templateUrl: './new-community-message.component.html',
  styleUrls: ['./new-community-message.component.scss'],
})
export class NewCommunityMessageComponent implements OnInit, OnChanges {
  private static readonly UTC_NOW = DateTime.utc();
  /** Pending community message. */
  @Input() public pendingCommunityMessage: CommunityMessage;
  /** Is device type filter allowed. */
  @Input() public allowDeviceTypeFilter: boolean;
  /** Is start time disabled. */
  @Input() public lockStartTime: boolean = false;
  /** The game title. */
  @Input() public gameTitle: GameTitle;
  /** True if component is using player identities. */
  @Input() isUsingPlayerIdentities: boolean = true;
  /** REVIEW-COMMENT: Output when a community message is created. */
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
    message: new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(this.messageMaxLength),
    ]),
    dateRange: new UntypedFormControl(this.dateRange, [Validators.required]),
    deviceType: new UntypedFormControl(DeviceType.All, [Validators.required]),
  };

  public newCommunityMessageForm: UntypedFormGroup = new UntypedFormGroup(this.formControls);

  public activePermAttribute = PermAttributeName.MessagePlayer;

  constructor(private readonly formBuilder: UntypedFormBuilder) {}

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

  /** Lifecycle hook. */
  public ngOnChanges(changes: BetterSimpleChanges<NewCommunityMessageComponent>): void {
    if (changes.isUsingPlayerIdentities) {
      this.activePermAttribute = this.isUsingPlayerIdentities
        ? PermAttributeName.MessagePlayer
        : PermAttributeName.MessageGroup;
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
