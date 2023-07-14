import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { UserModel } from '@models/user.model';
import { Select } from '@ngxs/store';
import { V2UsersService } from '@services/api-v2/users/users.service';
import { EmailAddresses } from '@shared/constants';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { UserState } from '@shared/state/user/user.state';
import { Observable, switchMap, takeUntil } from 'rxjs';

export const enum ExternalRedirectOption {
  Teams = 'teams',
  Email = 'email',
}

/** Teams contact resolver that opens up Team's group chat with Steward developers, */
@Component({
  templateUrl: './external-redirect.component.html',
  styleUrls: ['./external-redirect.component.scss'],
})
export class ExternalRedirectComponent extends BaseComponent implements OnInit {
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

  private readonly stewardEmailContacts: string[] = [
    EmailAddresses.LiveOpsAdmins,
    'jordan.yates@turn10.msgamestudios.com',
    'stephen.edmonds@playground-games.com',
  ];

  public generateLinkMonitor = new ActionMonitor('Generate external link');
  public readonly adminTeamLead = 'Live Ops Admins';
  public readonly adminTeamLeadEmail = EmailAddresses.LiveOpsAdmins;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly v2UsersService: V2UsersService,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    const externalTool = this.route.snapshot.params['externalTool'];
    let userProfile: UserModel;

    UserState.latestValidProfile$(this.profile$)
      .pipe(
        this.generateLinkMonitor.monitorSingleFire(),
        switchMap(user => {
          userProfile = user;
          return this.v2UsersService.getTeamLead$(userProfile.objectId);
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(teamLead => {
        this.redirect(externalTool, userProfile, teamLead);
      });
  }

  private redirect(
    externalTool: ExternalRedirectOption,
    user: UserModel,
    teamLead: UserModel,
  ): void {
    let externalHref: string = '';

    const teamName = !!teamLead ? teamLead?.team?.name : this.adminTeamLead;
    const teamLeadName = !!teamLead ? teamLead?.name : this.adminTeamLead;
    const teamLeadEmail = !!teamLead ? teamLead?.emailAddress : this.adminTeamLeadEmail;

    switch (externalTool) {
      case ExternalRedirectOption.Teams:
        externalHref = this.teamsContactHref(
          user?.emailAddress,
          user?.role,
          teamName,
          teamLeadName,
          teamLeadEmail,
        );
        break;
      case ExternalRedirectOption.Email:
        externalHref = this.emailContactHref(
          user?.emailAddress,
          user?.role,
          teamName,
          teamLeadName,
          teamLeadEmail,
        );
        break;
      default:
        throw new Error(`Invalid external tool provided: ${externalTool}`);
    }

    window.location.href = encodeURI(externalHref);
  }

  /** Generates Team's href. */
  private teamsContactHref(
    senderEmail: string,
    senderRole: string,
    teamName: string,
    teamLeadName: string,
    teamLeadEmail: string,
  ): string {
    return (
      'https://teams.microsoft.com/l/chat/0/0' +
      `?users=${this.stewardTeamContacts.join(',')}` +
      '&topicName=Steward - Contact Us' +
      `&message=(Add message here)\n\n\n` +
      `Email: ${senderEmail}\n` +
      `Role:  ${senderRole}\n` +
      `Team:  ${teamName}\n` +
      `Team Lead:  ${teamLeadName} (${teamLeadEmail})`
    );
  }

  /** Generates email href. */
  private emailContactHref(
    senderEmail: string,
    senderRole: string,
    teamName: string,
    teamLeadName: string,
    teamLeadEmail: string,
  ): string {
    return (
      `mailto:${this.stewardEmailContacts.join(';')}` +
      '?subject=[Steward - Contact Us] (Add subject here)' +
      `&body=(Add message here)\n\n` +
      `Email: ${senderEmail}\n` +
      `Role:  ${senderRole}\n` +
      `Team:  ${teamName}\n` +
      `Team Lead:  ${teamLeadName} (${teamLeadEmail})`
    );
  }
}
