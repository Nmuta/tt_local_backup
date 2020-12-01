import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ZafClientService } from './zaf-client.service';


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
  providedIn: 'root' ,
})
export class ZendeskService {
  constructor(private readonly zafClientService: ZafClientService) {}

  /**
   * True when this app is operating within zendesk.
   * @deprecated May erroneously return false for the first few ms of operation. Use @see inZendesk$ instead
   */
  public get inZendesk(): boolean {
    return !!this.zafClientService.client;
  }

  /**
   * True when this app is operating within zendesk.
   */
  public get inZendesk$(): Observable<boolean> {
    return this.zafClientService.client$.pipe(map(v => !!v));
  }

  /** Gets the zendesk ticket details. */
  public getTicketDetails$(): Observable<{ ticket: unknown }> {
    return this.zafClientService.runWithClient$(c => c.get('ticket'));
  }

  /** Gets the zendesk ticket requestor information. */
  public getTicketRequestor$(): Observable<TicketRequesterResponse> {
    return this.zafClientService.runWithClient$(c => c.get<TicketRequesterResponse>('ticket.requester'));
  }

  /** Gets the zendesk ticket fields. */
  public getTicketFields$(): Observable<TicketFieldsResponse> {
    return this.zafClientService.runWithClient$(c => c.get('ticketFields'));
  }

  /** Gets a zendesk custom ticket field. */
  public getTicketCustomField$(field: string): Observable<unknown> {
    return this.zafClientService.runWithClient$(c => c.get(`ticket.customField:${field}`));
  }

  /** Sends https request through zaf client. */
  public sendRequest$(reqSettings: ZafRequestOptions): Observable<unknown> {
    return this.zafClientService.runWithClient$(c => c.request(reqSettings));
  }

  /** Gets the current zendesk user. */
  public currentUser$(): Observable<unknown> {
    return this.zafClientService.runWithClient$(c => c.get('currentUser'));
  }

  /** Gets the zendesk context. */
  public context$(): Observable<unknown> {
    return this.zafClientService.runWithClient$(c => c.context());
  }

  /** Resizes the zendesk app. */
  public resize$(width: string, height: string): Observable<unknown> {
    return this.zafClientService.runWithClient$(c => c.invoke('resize', { width: width, height: height }));
  }

  /** Opens up the sepcified zendesk app. */
  public goToApp$(appLocation: string, appName: string, paramPath: string): Observable<unknown> {
    return this.zafClientService.runWithClient$(c => c.invoke('routeTo', appLocation, appName, paramPath));
  }
}
