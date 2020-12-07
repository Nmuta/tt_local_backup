import { Injectable } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import _ from 'lodash';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { TicketFieldsResponse, ZendeskService } from './zendesk.service';

/** Utility service for handling Zendesk Tickets. */
@Injectable({
  providedIn: 'root',
})
export class TicketService {
  constructor(private readonly zendesk: ZendeskService) {}

  /** Retrieves the gamertag attached to this ticket. */
  public getTicketRequestorGamertag$(): Observable<string> {
    return this.zendesk.getTicketRequestor$().pipe(
      map(response => response['ticket.requester']),
      map(requester => {
        // TODO: Check if gamertag was input into the custom ticket field.
        // If it was, use that over the ticket requestor as gamertag lookup.
        return requester.name;
      }),
    );
  }

  /** Retrieves the title this ticket is for, or null. */
  public getForzaTitle$(): Observable<GameTitleCodeName> {
    return this.zendesk.getTicketFields$().pipe(
      map(ticketFields => this.extractForzaTitleFromTicketFields(ticketFields)),
      switchMap(titleCustomField => this.getTitleName$(titleCustomField)),
      map(titleName => this.mapTitleName(titleName)));
  }

  /** Extracts the Title from the Ticket Fields response. */
  private extractForzaTitleFromTicketFields(ticketFields: TicketFieldsResponse): string {
    const result = _(ticketFields.ticketFields)
      .toPairs()
      .map(([_key, value]) => value as { label: string; name: string })
      .filter(entry => entry.label === 'Forza Title')
      .map(entry => entry.name)
      .last();
    return result;
  }

  /** Gets title data from ticket. */
  private getTitleName$(titleCustomField: string): Observable<string> {
    return this.zendesk
      .getTicketCustomField$(titleCustomField)
      .pipe(
        map(response => response[`ticket.customField:${titleCustomField}`] as string),
      );
  }

  /** Maps a title name from a ticket to an enum value. */
  private mapTitleName(titleName: string): GameTitleCodeName {
    const titleNameUppercase = titleName.toUpperCase();
    switch (titleNameUppercase) {
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
