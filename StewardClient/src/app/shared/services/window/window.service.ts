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
    window.addEventListener(eventName, func);
  }

  /** Removes event listener to the window. */
  public removeEventListener(eventName: string, func: EventListener) {
    window.removeEventListener(eventName, func);
  }

  /** Gets the window's top property. */
  public top() {
    return window.top;
  }

  /** Gets the window's location property. */
  public location() {
    return window.location;
  }

  /** Runs the window.open function. */
  public open(url, target): Window {
    return window.open(url, target);
  }

  /** Runs the window.close function. */
  public close() {
    return window.close();
  }

  /** Gets the window's zafClient property. */
  public zafClient(): any {
    return (window as any).zafClient;
  }
}
