// General
import { Injectable } from '@angular/core';
import * as ZAFClient from 'zendesk_app_framework_sdk';

/** Defines the Window Service. */
@Injectable({
  providedIn: 'root',
})
export class WindowService {
  constructor() {
    // Empty
  }

  /** Adds event listener to the window. */
  public addEventListener(eventName: string, func: EventListener) {
    (window as any).addEventListener(eventName, func);
  }

  /** Removes event listener to the window. */
  public removeEventListener(eventName: string, func: EventListener) {
    (window as any).removeEventListener(eventName, func);
  }

  /** Gets the window's top property. */
  public top(): any {
    return window.top;
  }

  /** Gets the window's location property. */
  public location(): any {
    return (window as any).location;
  }

  /** Runs the window.open function. */
  public open(url, target): any {
    return (window as any).open(url, target);
  }

  /** Gets the window's zafClient property. */
  public zafClient(): any {
    return (window as any).zafClient;
  }
}
