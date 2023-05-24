import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { UserModel } from '@models/user.model';
import { Select, Store } from '@ngxs/store';
import { V2UsersService } from '@services/api-v2/users/users.service';
import { EmailAddresses } from '@shared/constants';
import { UserState } from '@shared/state/user/user.state';
import { Observable, switchMap, takeUntil } from 'rxjs';

enum RequestType {
  Feature,
  Bug,
}

enum RequestImpact {
  Low,
  High,
}

/** Component for handling "Contact Us" forms. */
@Component({
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent extends BaseComponent implements OnInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  private readonly stewardTeamContacts: string[] = [
    'luke.geiken@microsoft.com',
    'madden.osei@microsoft.com',
    'jordan.yates@turn10.msgamestudios.com',
    'sharerdavid@microsoft.com',
    'caleb.moore@microsoft.com',
    'v-blebois@microsoft.com',
    'ellen.porter@microsoft.com',
    'stephen.edmonds@playground-games.com',
    'v-charlesyan@microsoft.com',
  ];

  public selectedRequestType = RequestType.Feature;
  public isSubmitted = false;
  public userProfile: UserModel;
  public teamLead: UserModel;
  public RequestType = RequestType;
  public RequestImpact = RequestImpact;
  public isMessageTooLong = false;

  public formControlsFeature = {
    description: new FormControl('', [Validators.required]),
    isBusinessCritital: new FormControl(false, [Validators.required]),
    internalImpact: new FormControl(RequestImpact.Low, [Validators.required]),
    externalImpact: new FormControl(RequestImpact.Low, [Validators.required]),
  };
  public formGroupFeature = new FormGroup(this.formControlsFeature);

  public formControlsBug = {
    description: new FormControl('', [Validators.required]),
    reproductionSteps: new FormControl('', [Validators.required]),
    isBusinessCritital: new FormControl(false, [Validators.required]),
    internalImpact: new FormControl(RequestImpact.Low, [Validators.required]),
    externalImpact: new FormControl(RequestImpact.Low, [Validators.required]),
    isWorkaround: new FormControl(false, [Validators.required]),
  };
  public formGroupBug = new FormGroup(this.formControlsBug);

  public readonly adminTeamLead = 'Live Ops Admins';
  public readonly adminTeamLeadEmail = EmailAddresses.LiveOpsAdmins;

  constructor(protected readonly store: Store, private readonly v2UsersService: V2UsersService) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    UserState.latestValidProfile$(this.profile$)
      .pipe(
        switchMap(user => {
          this.userProfile = user;
          return this.v2UsersService.getTeamLead$(user.objectId);
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(teamLead => {
        this.teamLead = teamLead;
      });
  }

  /** Submit bug request. */
  public submitBug(): void {
    const message =
      `Bug Report\n\n` +
      `Description: ${this.formControlsBug.description.value}\n` +
      `Reproduction Steps: ${this.formControlsBug.description.value}\n` +
      `Is this business critical?: ${
        this.formControlsBug.isBusinessCritital.value ? 'Yes' : 'No'
      }\n` +
      `Is there a workaround?: ${this.formControlsBug.isWorkaround.value ? 'Yes' : 'No'}\n` +
      `Estimated internal impact: ${RequestImpact[this.formControlsBug.externalImpact.value]}\n` +
      `Estimated external impact: ${RequestImpact[this.formControlsBug.internalImpact.value]}\n`;

    this.sendTeamsMessage(message);
  }

  /** Submit feature request. */
  public submitFeature(): void {
    const message =
      `Feature Request\n\n` +
      `Description: ${this.formControlsFeature.description.value}\n` +
      `Is this business critical?: ${
        this.formControlsFeature.isBusinessCritital.value ? 'Yes' : 'No'
      }\n` +
      `Estimated internal impact: ${
        RequestImpact[this.formControlsFeature.externalImpact.value]
      }\n` +
      `Estimated external impact: ${
        RequestImpact[this.formControlsFeature.internalImpact.value]
      }\n`;

    this.sendTeamsMessage(message);
  }

  /** Reset the contact us form. */
  public resetForm(): void {
    this.formGroupBug.reset();
    this.formGroupFeature.reset();
    this.isSubmitted = false;
    this.isMessageTooLong = false;
  }

  /** Generates and sends Team's message. */
  private sendTeamsMessage(message: string) {
    this.isMessageTooLong = false;
    this.isSubmitted = false;
    const teamName = !!this.teamLead ? this.teamLead?.team?.name : this.adminTeamLead;
    const teamLeadName = !!this.teamLead ? this.teamLead?.name : this.adminTeamLead;
    const teamLeadEmail = !!this.teamLead ? this.teamLead?.emailAddress : this.adminTeamLeadEmail;

    const formattedMessage =
      `${message}\n` +
      `Email: ${this.userProfile?.emailAddress}\n` +
      `Role: ${this.userProfile?.role}\n` +
      `Team: ${teamName}\n` +
      `Team Lead: ${teamLeadName} (${teamLeadEmail})`;

    if (formattedMessage.length >= 400) {
      this.isMessageTooLong = true;
      return;
    }

    this.isSubmitted = true;
    const externalHref =
      'https://teams.microsoft.com/l/chat/0/0' +
      `?users=${this.stewardTeamContacts.join(',')}` +
      '&topicName=Steward - Contact Us' +
      `&message=${formattedMessage}`;

    window.open(encodeURI(externalHref), '_blank');
  }
}
