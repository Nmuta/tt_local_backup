import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserModel } from '@models/user.model';
import { Store } from '@ngxs/store';
import { EmailAddresses } from '@shared/constants';
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
    'jordan.yates@turn10.msgamestudios.com',
    'sharerdavid@microsoft.com',
    'caleb.moore@microsoft.com',
    'v-blebois@microsoft.com',
    'ellen.porter@microsoft.com',
    'stephen.edmonds@playground-games.com',
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
      `mailto:${EmailAddresses.LiveOpsAdmins}` +
      '?subject=[Steward - Contact Us] (Add subject here)' +
      `&body=(Add message here)\n\n` +
      `Email: ${senderEmail}\n` +
      `Role:  ${senderRole}`
    );
  }
}
