import { WindowService } from '@shared/services/window';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ZendeskService {

    constructor(
        private windowService: WindowService
    ) {}

    public getTicketDetails(): Observable<any> {
        return this.windowService.zafClient().get("ticket"); 
    }

    public getTicketRequestor(): Observable<object> {
        return this.windowService.zafClient().get("ticket.requester");
    }

    public getTicketFields(): Observable<object> {
        return this.windowService.zafClient().get('ticketFields');
    }

    public getTicketCustomField(field): Observable<object> {
        return this.windowService.zafClient().get(`ticket.customField:${field}`);
    }

    public sendRequest(reqSettings) {
        return this.windowService.zafClient().request(reqSettings);
    }

    public currentUser(): Observable<any> {
        var test = this.windowService.zafClient();
        return this.windowService.zafClient().get('currentUser');
    }

    public context(): Observable<object> {
        return this.windowService.zafClient().context();
    }

    public resize(width: string, height: string) {
        this.windowService.zafClient().invoke('resize', { 'width': width, 'height': height });
    }

    public goToApp(appLocation, appName, paramPath) {
        this.windowService.zafClient().invoke('routeTo', appLocation, appName, paramPath);
    }
}
