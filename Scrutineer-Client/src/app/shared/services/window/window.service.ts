// General
import { Injectable } from '@angular/core';
import * as ZAFClient from 'zendesk_app_framework_sdk';

@Injectable({
    providedIn: 'root'
})
export class WindowService {
    constructor() { }

    public addEventListener(eventName: string, func: EventListener) {
        (<any>window).addEventListener(eventName, func);
    }

    public removeEventListener(eventName: string, func: EventListener) {
        (<any>window).removeEventListener(eventName, func);
    }

    public top(): any {
        return window.top;
    }

    public location(): any {
        return (<any>window).location;
    }

    public open(url, target): any {
        return (<any>window).open(url, target);
    }

    public initZafClient(): any {
        (<any>window).zafClient = ZAFClient.init();
    }

    public zafClient(): any {
        return (<any>window).zafClient;
    }
}
