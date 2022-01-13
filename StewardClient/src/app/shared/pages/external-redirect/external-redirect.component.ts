import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserModel } from '@models/user.model';
import { Store } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';

export const enum ExternalRedirectOption {
  Teams = 'teams',
  Email = 'email',
}

/** Teams contact resolver that opens up Team's group chat with Steward developers, */
@Component({
  template: '',
})
export class ExternalRedirectComponent implements OnInit {
  private readonly stewardTeamEmails: string[] = [
    'luke.geiken@microsoft.com',
    'madden.osei@microsoft.com',
    'v-jyates@microsoft.com',
    'david.sharer@turn10.msgamestudios.com',
    'caleb.moore@microsoft.com',
  ];

  constructor(private readonly store: Store, private readonly route: ActivatedRoute) {}

  /** Lifecycle hook. */
  public ngOnInit(): void {
    const externalTool = this.route.snapshot.params['externalTool'];
    const profile = this.store.selectSnapshot<UserModel>(UserState.profile);

    let externalHref: string = '';

    switch (externalTool) {
      case ExternalRedirectOption.Teams:
        externalHref = this.teamsContactHref(profile?.emailAddress, profile?.role);
        break;
      case ExternalRedirectOption.Email:
        externalHref = this.emailContactHref(profile?.emailAddress, profile?.role);
        break;
      default:
        throw new Error(`Invalid external tool provided: ${externalTool}`);
    }

    window.location.href = encodeURI(externalHref);
  }

  /** Generates Team's href. */
  private teamsContactHref(senderEmail: string, senderRole: string): string {
    return (
      'https://teams.microsoft.com/l/chat/0/0' +
      `?users=${this.stewardTeamEmails.join(',')}` +
      '&topicName=Steward - Contact Us' +
      `&message=(Add message here)\n\n\n` +
      `Email: ${senderEmail}\n` +
      `Role:  ${senderRole}`
    );
  }

  /** Generates email href. */
  private emailContactHref(senderEmail: string, senderRole: string): string {
    return (
      'mailto:t10liveopstools@microsoft.com' +
      '?subject=[Steward - Contact Us] (Add subject here)' +
      `&body=(Add message here)\n\n` +
      `Email: ${senderEmail}\n` +
      `Role:  ${senderRole}`
    );
  }
}
