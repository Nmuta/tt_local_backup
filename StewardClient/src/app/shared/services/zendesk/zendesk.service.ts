import { Injectable } from '@angular/core';
import { ZAFRequestOptions } from '@shared/definitions/zaf-client';
import { WindowService } from '@shared/services/window';
import { from, Observable } from 'rxjs';

export interface TicketRequesterResponse {
  'ticket.requester': { name: string };
}
export interface TicketFieldsResponse {
  ticketFields: {
    [key: string]: {
      label: 'Forza Title';
      name: string;
    };
  };
}

/** Defines the Zendesk Service. */
@Injectable({
  providedIn: 'root',
})
export class ZendeskService {
  constructor(private windowService: WindowService) {}

  /** Gets the zendesk ticket details. */
  public getTicketDetails(): Observable<{ ticket: unknown }> {
    return from(this.windowService.zafClient().get('ticket'));
  }

  /** Gets the zendesk ticket requestor information. */
  public getTicketRequestor(): Observable<TicketRequesterResponse> {
    return from(this.windowService.zafClient().get<TicketRequesterResponse>('ticket.requester'));
  }

  /** Gets the zendesk ticket fields. */
  public getTicketFields(): Observable<TicketFieldsResponse> {
    return from(this.windowService.zafClient().get('ticketFields'));
  }

  /** Gets a zendesk custom ticket field. */
  public getTicketCustomField(field: string): Observable<unknown> {
    return from(this.windowService.zafClient().get(`ticket.customField:${field}`));
  }

  /** Sends https request through zaf client. */
  public sendRequest(reqSettings: ZAFRequestOptions): Observable<unknown> {
    return from(this.windowService.zafClient().request(reqSettings));
  }

  /** Gets the current zendesk user. */
  public currentUser(): Observable<unknown> {
    return from(this.windowService.zafClient().get('currentUser'));
  }

  /** Gets the zendesk context. */
  public context(): Observable<unknown> {
    return from(this.windowService.zafClient().context());
  }

  /** Resizes the zendesk app. */
  public resize(width: string, height: string): void {
    this.windowService.zafClient().invoke('resize', { width: width, height: height });
  }

  /** Opens up the sepcified zendesk app. */
  public goToApp(appLocation: string, appName: string, paramPath: string): void {
    this.windowService.zafClient().invoke('routeTo', appLocation, appName, paramPath);
  }
}
