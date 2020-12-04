import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base-component.component';
import { GameTitleCodeName } from '@models/enums';
import { Select } from '@ngxs/store';
import { UserModel } from '@shared/models/user.model';
import { TicketFieldsResponse, ZendeskService } from '@shared/services/zendesk';
import { UserState } from '@shared/state/user/user.state';
import _ from 'lodash';
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
  public gameTitle: GameTitleCodeName;
  public gamertag: string;

  constructor(
    private readonly router: Router,
    private readonly zendeskService: ZendeskService,
  ) {
    super();
  }

  /** Access layer for html to check again code name enum. */
  public get gameTitleCodeNames(): typeof GameTitleCodeName {
    return GameTitleCodeName;
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
          this.extractAndSetData();
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

  /** Opens up inventory app with predefined info filled out. */
  public goToInventory(): void {
    const appSection = this.gameTitle + '/' + this.xuid;
    this.zendeskService.goToApp$('nav_bar', 'forza-inventory-support', appSection).subscribe();
  }

  /** Coordinates the extraction of data from the ticket. */
  private async extractAndSetData(): Promise<void> {
    this.gamertag = await this.getTicketRequestorGamertag();

    const ticketFields = await this.zendeskService.getTicketFields$().toPromise();
    const titleCustomField = this.extractForzaTitle(ticketFields);

    this.gameTitle = await this.getTitle(titleCustomField);
  }

  private async getTicketRequestorGamertag(): Promise<string> {
    const response = await this.zendeskService.getTicketRequestor$().toPromise();
    const requester = response['ticket.requester'];

    // TODO: Check if gamertag was input into the custom ticket field.
    // If it was, use that over the ticket requestor as gamertag lookup.
    return requester.name;
  }

  private extractForzaTitle(ticketFields: TicketFieldsResponse): string {
    return _(ticketFields)
      .toPairs()
      .map(([_key, value]) => value as { label: string, name: string })
      .filter(entry => entry.label === 'Forza Title')
      .map(entry => entry.name)
      .last();
  }

  /** Gets title data from ticket. */
  private async getTitle(titleCustomField: string): Promise<GameTitleCodeName> {
    const response = await this.zendeskService.getTicketCustomField$(titleCustomField).toPromise()
    const titleName = response[`ticket.customField:${titleCustomField}`] as string;
    return this.mapTitleName(titleName);
  }

  private mapTitleName(titleName: string): GameTitleCodeName {
    const titleNameUppercase = titleName.toUpperCase();
    switch(titleNameUppercase) {
      case 'FORZA_STREET':
        return GameTitleCodeName.Street;
      case 'FORZA_HORIZON_4':
        return GameTitleCodeName.FH4;
      case 'FORZA_MOTORSPORT_7':
        return GameTitleCodeName.FM7;
      case 'FORZA_HORIZON_3':
        return GameTitleCodeName.FH3;
      default:
        return null;
    }
  }
}
