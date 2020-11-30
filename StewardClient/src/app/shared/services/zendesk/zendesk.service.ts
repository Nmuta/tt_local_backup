import { Injectable } from '@angular/core';
import ZAFClient, { ZafClientActual, ZafRequestOptions } from '@shared/definitions/zaf-client';
import { from, Observable } from 'rxjs';

/** A typings shell for a zendesk response. */
export interface TicketRequesterResponse {
  'ticket.requester': { name: string };
}

/** A typings shell for a zendesk response. */
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
  private readonly zafClient: ZafClientActual;

  constructor() {
    this.zafClient = ZAFClient.init();
  }

  /** True when this app is operating within zendesk. */
  public get inZendesk(): boolean {
    return !!this.zafClient;
  }

  /** Gets the zendesk ticket details. */
  public getTicketDetails(): Observable<{ ticket: unknown }> {
    return from(this.zafClient.get('ticket'));
  }

  /** Gets the zendesk ticket requestor information. */
  public getTicketRequestor(): Observable<TicketRequesterResponse> {
    return from(this.zafClient.get<TicketRequesterResponse>('ticket.requester'));
  }

  /** Gets the zendesk ticket fields. */
  public getTicketFields(): Observable<TicketFieldsResponse> {
    return from(this.zafClient.get('ticketFields'));
  }

  /** Gets a zendesk custom ticket field. */
  public getTicketCustomField(field: string): Observable<unknown> {
    return from(this.zafClient.get(`ticket.customField:${field}`));
  }

  /** Sends https request through zaf client. */
  public sendRequest(reqSettings: ZafRequestOptions): Observable<unknown> {
    return from(this.zafClient.request(reqSettings));
  }

  /** Gets the current zendesk user. */
  public currentUser(): Observable<unknown> {
    return from(this.zafClient.get('currentUser'));
  }

  /** Gets the zendesk context. */
  public context(): Observable<unknown> {
    return from(this.zafClient.context());
  }

  /** Resizes the zendesk app. */
  public resize(width: string, height: string): void {
    this.zafClient.invoke('resize', { width: width, height: height });
  }

  /** Opens up the sepcified zendesk app. */
  public goToApp(appLocation: string, appName: string, paramPath: string): void {
    this.zafClient.invoke('routeTo', appLocation, appName, paramPath);
  }
}
