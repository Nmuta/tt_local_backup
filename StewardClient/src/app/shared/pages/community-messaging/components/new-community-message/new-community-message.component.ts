import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommunityMessage } from '@models/community-message';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { DateValidators } from '@shared/validators/date-validators';
import { DateTime } from 'luxon';
import { toDateTime } from '@helpers/to-date-time';

/** Outputs a new community message. */
@Component({
  selector: 'new-community-message',
  templateUrl: './new-community-message.component.html',
  styleUrls: ['./new-community-message.component.scss'],
})
export class NewCommunityMessageComponent implements OnInit {
  @Input() public pendingCommunityMessage: CommunityMessage;
  @Output() public emitNewCommunityMessage = new EventEmitter<CommunityMessage>();
  public readonly messageMaxLength: number = 512;

  public arrowIcon = faArrowCircleRight;

  /** New community message form. */
  public newCommunityMessageForm: FormGroup = this.formBuilder.group({
    message: ['', [Validators.required, Validators.maxLength(this.messageMaxLength)]],
    expireTime: ['', [Validators.required, DateValidators.isAfter(DateTime.local())]],
  });

  constructor(private readonly formBuilder: FormBuilder) {}

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (!!this.pendingCommunityMessage) {
      this.newCommunityMessageForm.controls['message'].setValue(
        this.pendingCommunityMessage.message,
      );
      this.newCommunityMessageForm.controls['expireTime'].setValue(
        this.pendingCommunityMessage.expiryDate.toISO(),
      );
    }
  }

  /** Testing */
  public createMessage(): void {
    const message = this.newCommunityMessageForm.controls['message'].value;
    const expireTime = toDateTime(this.newCommunityMessageForm.controls['expireTime'].value);
    const expireTimeDuration = expireTime.diff(DateTime.local().startOf('day'));

    this.emitNewCommunityMessage.emit({
      message: message,
      expiryDate: expireTime,
      duration: expireTimeDuration,
    } as CommunityMessage);
  }
}
