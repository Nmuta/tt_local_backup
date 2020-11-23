// General
import { Injectable} from '@angular/core';
import { Actions, ofActionDispatched } from '@ngxs/store';
import { ZAFClient } from '@shared/definitions/zaf-client';
import { Subject } from 'rxjs';
import { WindowOpen } from './window.actions';

/** Defines the Window Service. */
@Injectable({
  providedIn: 'root',
})
export class WindowService {
  public onDestroy$ = new Subject();
  constructor(private actions$: Actions) {
    this.actions$
      .pipe(ofActionDispatched(WindowOpen))
      .subscribe(action => this.open(action.url, action.target));
  }

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

  /** Runs the window.open function. */
  public open(url: string, target: string): Window {
    return window.open(url, target);
  }

  /** Runs the window.close function. */
  public close(): void {
    return window.close();
  }

  /** Gets the window's zafClient property. */
  public zafClient(): ZAFClient {
    return window.zafClient;
  }
}
