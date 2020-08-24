import { Injectable } from '@angular/core';
import { WindowService } from '@shared/services/window';
import { Observable, of, throwError } from 'rxjs';

/** Defines the Zendesk Service. */
@Injectable({
    providedIn: 'root'
})
export class ZendeskService {

    constructor(
        private windowService: WindowService
    ) {}

    /** Gets the zendesk ticket details. */
    public getTicketDetails(): Observable<any> {
        return this.windowService.zafClient().get('ticket');
    }

    /** Gets the zendesk ticket requestor information. */
    public getTicketRequestor(): Observable<object> {
        return this.windowService.zafClient().get('ticket.requester');
    }

    /** Gets the zendesk ticket fields. */
    public getTicketFields(): Observable<object> {
        return this.windowService.zafClient().get('ticketFields');
    }

    /** Gets a zendesk custom ticket field. */
    public getTicketCustomField(field): Observable<object> {
        return this.windowService.zafClient().get(`ticket.customField:${field}`);
    }

    /** Sends https request through zaf client. */
    public sendRequest(reqSettings) {
        return this.windowService.zafClient().request(reqSettings);
    }

    /** Gets the current zendesk user. */
    public currentUser(): Observable<any> {
        return this.windowService.zafClient().get('currentUser');
    }

    /** Gets the zendesk context. */
    public context(): Observable<object> {
        return this.windowService.zafClient().context();
    }

    /** Resizes the zendesk app. */
    public resize(width: string, height: string) {
        this.windowService.zafClient().invoke('resize', { 'width': width, 'height': height });
    }

    /** Opens up the sepcified zendesk app. */
    public goToApp(appLocation, appName, paramPath) {
        this.windowService.zafClient().invoke('routeTo', appLocation, appName, paramPath);
    }
}
