import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommunityMessage } from '@models/community-message';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { DateValidators } from '@shared/validators/date-validators';
import { DateTime } from 'luxon';
import { toDateTime } from '@helpers/luxon';
import { DeviceType } from '@models/enums';

/** Outputs a new community message. */
@Component({
  selector: 'new-community-message',
  templateUrl: './new-community-message.component.html',
  styleUrls: ['./new-community-message.component.scss'],
})
export class NewCommunityMessageComponent implements OnInit {
  @Input() public pendingCommunityMessage: CommunityMessage;
  @Input() public allowDeviceTypeFilter: boolean;
  @Output() public emitNewCommunityMessage = new EventEmitter<CommunityMessage>();
  public readonly messageMaxLength: number = 512;

  public arrowIcon = faArrowCircleRight;

  public deviceTypes: string[] = Object.values(DeviceType);
  /** New community message form. */
  public formControls = {
    message: new FormControl('', [
      Validators.required,
      Validators.maxLength(this.messageMaxLength),
    ]),
    expireTime: new FormControl('', [
      Validators.required,
      DateValidators.isAfter(DateTime.local()),
    ]),
    deviceType: new FormControl(DeviceType.All, [Validators.required]),
  };

  public newCommunityMessageForm: FormGroup = new FormGroup(this.formControls);

  constructor(private readonly formBuilder: FormBuilder) {}

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (!!this.pendingCommunityMessage) {
      this.formControls.message.setValue(this.pendingCommunityMessage.message);
      this.formControls.expireTime.setValue(this.pendingCommunityMessage.expiryDate.toISO());
      this.formControls.deviceType.setValue(
        this.pendingCommunityMessage.deviceType ?? DeviceType.All,
      );
    }
  }

  /** Create message */
  public createMessage(): void {
    const message = this.formControls.message.value;
    const expireTime = toDateTime(this.formControls.expireTime.value);
    const expireTimeDuration = expireTime.diff(DateTime.local().startOf('day'));
    const deviceType = this.allowDeviceTypeFilter ? this.formControls.deviceType.value : null;

    this.emitNewCommunityMessage.emit({
      message: message,
      expiryDate: expireTime,
      duration: expireTimeDuration,
      deviceType: deviceType,
    } as CommunityMessage);
  }
}
