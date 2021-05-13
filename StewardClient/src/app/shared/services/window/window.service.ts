import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { Observable, of } from 'rxjs';
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

  /** Gets the window's location property. */
  public location(): Location {
    return window.location;
  }

  /** Runs the window.open function. */
  @Action(WindowOpen)
  public openAction$(_: StateContext<void>, action: WindowOpen): Observable<Window> {
    return of(window.open(action.url, action.target));
  }
}
