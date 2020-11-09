import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base-component.component';
import { GameTitleCodeNames } from '@models/enums';
import { Select } from '@ngxs/store';
import { Clipboard } from '@shared/helpers/clipboard';
import { ScrutineerDataParser } from '@shared/helpers/scrutineer-data-parser/scrutineer-data-parser.helper';
import { UserModel } from '@shared/models/user.model';
import { ZendeskService } from '@shared/services/zendesk';
import { UserState } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { environment } from '../../environments/environment';

/** Defines the ticket sidebar component. */
@Component({
  templateUrl: './ticket-app.html',
  styleUrls: ['./ticket-app.scss'],
})
export class TicketAppComponent
  extends BaseComponent
  implements OnInit, AfterViewInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  public appName = 'ticket-sidebar';

  public loading: boolean;
  public profile: UserModel;
  public xuid: string;
  public gameTitle: GameTitleCodeNames;
  public gamertag: string;

  public isStreet: boolean;
  public isFH4: boolean;
  public isFM7: boolean;
  public isFH3: boolean;

  constructor(private router: Router, private zendeskService: ZendeskService) {
    super();
  }

  /** Access layer for html to check again code name enum. */
  public get gameTitleCodeNames(): typeof GameTitleCodeNames {
    return GameTitleCodeNames;
  }

  /** Logic for the OnInit component lifecycle. */
  public ngOnInit() {
    this.loading = true;
    UserState.latestValidProfile$(this.profile$)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        profile => {
          this.loading = false;
          this.profile = profile;
          if (!this.profile) {
            this.router.navigate([`/auth`], {
              queryParams: { from: this.appName },
            });
          } else {
            this.getTicketRequestor();
          }
        },
        _error => {
          this.loading = false;
          this.router.navigate([`/auth`], {
            queryParams: { from: this.appName },
          });
        }
      );
  }

  /** Logic for the AfterViewInit component lifecycle. */
  public ngAfterViewInit() {
    this.zendeskService.resize('100%', '500px');
  }

  /** Gets the ticket requestor information. */
  public getTicketRequestor() {
    this.zendeskService.getTicketRequestor().subscribe((response: any) => {
      const requester = response['ticket.requester'];

      // TODO: Check if gamertag was input into the custom ticket field.
      // If it was, use that over the ticket requestor as gamertag lookup.
      this.gamertag = requester.name;
      this.getTicketFields();
    });
  }

  /** Gets all the ticket's custom fields. */
  public getTicketFields() {
    this.zendeskService.getTicketFields().subscribe((response: any) => {
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
  public getTitleData(titleCustomField) {
    this.zendeskService
      .getTicketCustomField(titleCustomField)
      .subscribe(response => {
        const titleName = response[`ticket.customField:${titleCustomField}`];
        const titleNameUppercase = titleName.toUpperCase();

        this.gameTitle =
          titleNameUppercase === 'FORZA_STREET'
            ? GameTitleCodeNames.Street
            : titleNameUppercase === 'FORZA_HORIZON_4'
            ? GameTitleCodeNames.FH4
            : titleNameUppercase === 'FORZA_MOTORSPORT_7'
            ? GameTitleCodeNames.FM7
            : titleNameUppercase === 'FORZA_HORIZON_3'
            ? GameTitleCodeNames.FH3
            : null;
      });
  }

  /** Opens up inventory app with predefined info filled out. */
  public goToInventory() {
    const appSection = this.gameTitle + '/' + this.xuid;
    this.zendeskService.goToApp(
      'nav_bar',
      'forza-inventory-support',
      appSection
    );
  }
}
