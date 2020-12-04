import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base-component.component';
import { GameTitleCodeNames } from '@models/enums';
import { Select } from '@ngxs/store';
import { UserModel } from '@shared/models/user.model';
import { ZendeskService } from '@shared/services/zendesk';
import { UserState } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/** Coordination component for for ticket-app. */
@Component({
  templateUrl: './ticket-app.component.html',
  styleUrls: ['./ticket-app.component.scss'],
})
export class TicketAppComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  public appName = 'ticket-sidebar';

  public loading: boolean;
  public profile: UserModel;
  public xuid: string;
  public gameTitle: GameTitleCodeNames;
  public gamertag: string;

  constructor(
    private readonly router: Router,
    private readonly zendeskService: ZendeskService,
  ) {
    super();
  }

  /** Access layer for html to check again code name enum. */
  public get gameTitleCodeNames(): typeof GameTitleCodeNames {
    return GameTitleCodeNames;
  }

  /** Logic for the OnInit component lifecycle. */
  public ngOnInit(): void {
    this.loading = true;
    UserState.latestValidProfile$(this.profile$)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        profile => {
          this.loading = false;
          this.profile = profile;
          this.getTicketRequestor();
        },
        _error => {
          this.loading = false;
        },
      );
  }

  /** Logic for the AfterViewInit component lifecycle. */
  public ngAfterViewInit(): void {
    this.zendeskService.resize$('100%', '500px').subscribe();
  }

  /** Gets the ticket requestor information. */
  public getTicketRequestor(): void {
    this.zendeskService.getTicketRequestor$().subscribe(response => {
      const requester = response['ticket.requester'];

      // TODO: Check if gamertag was input into the custom ticket field.
      // If it was, use that over the ticket requestor as gamertag lookup.
      this.gamertag = requester.name;
      this.getTicketFields();
    });
  }

  /** Gets all the ticket's custom fields. */
  public getTicketFields(): void {
    this.zendeskService.getTicketFields$().subscribe(response => {
      const ticketFields = response.ticketFields;
      let titleCustomField = '';
      for (const field in ticketFields) {
        if (ticketFields[field].label === 'Forza Title') {
          titleCustomField = ticketFields[field].name;
        }
      }

      this.getTitleData(titleCustomField);
    });
  }

  /** Gets title data from ticket. */
  public getTitleData(titleCustomField: string): void {
    this.zendeskService.getTicketCustomField$(titleCustomField).subscribe(response => {
      const titleName = response[`ticket.customField:${titleCustomField}`];
      this.gameTitle = this.mapTitleName(titleName);
    });
  }

  /** Opens up inventory app with predefined info filled out. */
  public goToInventory(): void {
    const appSection = this.gameTitle + '/' + this.xuid;
    this.zendeskService.goToApp$('nav_bar', 'forza-inventory-support', appSection).subscribe();
  }

  private mapTitleName(titleName: string): GameTitleCodeNames {
    const titleNameUppercase = titleName.toUpperCase();
    switch(titleNameUppercase) {
      case 'FORZA_STREET':
        return GameTitleCodeNames.Street;
      case 'FORZA_HORIZON_4':
        return GameTitleCodeNames.FH4;
      case 'FORZA_MOTORSPORT_7':
        return GameTitleCodeNames.FM7;
      case 'FORZA_HORIZON_3':
        return GameTitleCodeNames.FH3;
      default:
        return null;
    }
  }
}
