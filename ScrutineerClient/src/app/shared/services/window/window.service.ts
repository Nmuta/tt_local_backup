// General
import { Injectable } from '@angular/core';
import * as ZAFClient from 'zendesk_app_framework_sdk';

@Injectable({
    providedIn: 'root'
})
export class WindowService {
    constructor() { }

    public addEventListener(eventName: string, func: EventListener) {
        (window as any).addEventListener(eventName, func);
    }

    public removeEventListener(eventName: string, func: EventListener) {
        (window as any).removeEventListener(eventName, func);
    }

    public top(): any {
        return window.top;
    }

    public location(): any {
        return (window as any).location;
    }

    public open(url, target): any {
        return (window as any).open(url, target);
    }

    public zafClient(): any {
        return (window as any).zafClient;
    }
}
