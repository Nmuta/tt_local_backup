import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BaseService } from '@components/base-component/base.service';
import { includes } from 'lodash';
import { Observable, ReplaySubject, filter, map, of, switchMap, takeUntil } from 'rxjs';

/**
 *  Service to track the visible state of sidebars in the app.
 */
@Injectable({
  providedIn: 'root',
})
export class SidebarService extends BaseService {
  private isVisible: boolean;
  private changes$ = new ReplaySubject<boolean>(1);

  /** Check if the current app state has an open sidebar. */
  public get isOpen(): boolean {
    return this.isVisible;
  }

  /** Check if the current app state has an open sidebar. */
  public get isClosed(): boolean {
    return !this.isVisible;
  }

  public readonly _isClosed$ = new ReplaySubject<boolean>(1);
  public readonly _isOpen$ = new ReplaySubject<boolean>(1);

  /** Observable that fires anytime a sidebar is opened. */
  public get isOpen$(): Observable<boolean> {
    return this._isOpen$;
  }

  /** Observable that fires anytime a sidebar is closed. */
  public get isClosed$(): Observable<boolean> {
    return this._isClosed$;
  }

  constructor(router: Router) {
    super();

    router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(event => event as NavigationEnd),
        map(event => {
          return includes(event.url, '//sidebar:');
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(isVisible => {
        this.changes$.next(isVisible);
      });

    this.changes$.pipe(takeUntil(this.onDestroy$)).subscribe(isVisible => {
      this.isVisible = isVisible;
    });

    this.changes$.pipe(takeUntil(this.onDestroy$)).subscribe(isVisible => {
      this._isClosed$.next(!isVisible);
    });

    this.changes$.pipe(takeUntil(this.onDestroy$)).subscribe(isVisible => {
      this._isOpen$.next(isVisible);
    });

    this.changes$.next(this.isVisible);
  }
}
