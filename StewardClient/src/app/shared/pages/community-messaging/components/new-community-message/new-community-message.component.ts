import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommunityMessage } from '@models/community-message';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { DateValidators } from '@shared/validators/date-validators';

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
    expireTime: ['', [Validators.required, DateValidators.isAfter(moment())]],
  });

  constructor(private readonly formBuilder: FormBuilder) {}

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (!!this.pendingCommunityMessage) {
      this.newCommunityMessageForm.controls['message'].setValue(
        this.pendingCommunityMessage.message,
      );
      this.newCommunityMessageForm.controls['expireTime'].setValue(
        this.pendingCommunityMessage.expiryDate.toISOString(),
      );
    }
  }

  /** Testing */
  public createMessage(): void {
    const message = this.newCommunityMessageForm.controls['message'].value;
    const expireTime = this.newCommunityMessageForm.controls['expireTime'].value;
    const expireTimeDuration = moment.duration(moment(expireTime).diff(moment().startOf('day')));

    this.emitNewCommunityMessage.emit({
      message: message,
      expiryDate: moment(expireTime),
      duration: expireTimeDuration,
    } as CommunityMessage);
  }
}
