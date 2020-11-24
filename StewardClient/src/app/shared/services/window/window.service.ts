// General
import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { ZAFClient } from '@shared/definitions/zaf-client';
import { WindowOpen } from './window.actions';

/** Defines the Window Service. */
@Injectable({ providedIn: 'root' })
@State<void>({ name: 'window' })
export class WindowService {
  /** Checks if this window is in an iframe. */
  public get isInIframe(): boolean {
    // based on https://stackoverflow.com/questions/326069/how-to-identify-if-a-webpage-is-being-loaded-inside-an-iframe-or-directly-into-t
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  }

  /** Adds event listener to the window. */
  public addEventListener(eventName: string, func: EventListener): void {
    window.addEventListener(eventName, func);
  }

  /** Removes event listener to the window. */
  public removeEventListener(eventName: string, func: EventListener): void {
    window.removeEventListener(eventName, func);
  }

  /** Gets the window's top property. */
  public top(): Window {
    return window.top;
  }

  /** Gets the window's location property. */
  public location(): Location {
    return window.location;
  }

  /** Runs the window.close function. */
  public close(): void {
    return window.close();
  }

  /** Gets the window's zafClient property. */
  public zafClient(): ZAFClient {
    return window.zafClient;
  }

  /** Runs the window.open function. */
  @Action(WindowOpen)
  private openAction(_: StateContext<void>, action: WindowOpen) {
    return window.open(action.url, action.target);
  }
}
