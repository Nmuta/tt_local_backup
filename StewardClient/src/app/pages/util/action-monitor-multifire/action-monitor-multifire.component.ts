import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { ApiService } from '@services/api';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { EMPTY, Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

const DELAY = 10_000; /*ms*/

type TWhich =
  | 'triggerSuccess'
  | 'triggerInternalException'
  | 'triggerAngularException'
  | 'trigger4xxMsApiResponse'
  | 'trigger4xxUnknownResponse'
  | 'trigger5xxMsApiResponse'
  | 'trigger5xxUnknownResponse';

/**
 * A demo component for action monitors (multifire).
 */
@Component({
  templateUrl: './action-monitor-multifire.component.html',
  styleUrls: ['./action-monitor-multifire.component.scss'],
})
export class ActionMonitorMultifireComponent extends BaseComponent implements OnInit {
  public expandRoutes: boolean;
  public id: number;
  public which: string;
  public actionsAvailable = [
    'triggerSuccess',
    'triggerInternalException',
    'triggerAngularException',
    'trigger4xxMsApiResponse',
    'trigger4xxUnknownResponse',
    'trigger5xxMsApiResponse',
    'trigger5xxUnknownResponse',
  ];
  public disableToggles: boolean[] = [false, false, false];

  public monitors: ActionMonitor[] = [
    new ActionMonitor('Monitor 1'),
    new ActionMonitor('Monitor 2'),
    new ActionMonitor('Monitor 3'),
  ];

  public subjects: Subject<TWhich>[] = [
    new Subject<TWhich>(),
    new Subject<TWhich>(),
    new Subject<TWhich>(),
  ];

  public results: unknown[] = [undefined, undefined, undefined];

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly http: HttpClient,
    private readonly api: ApiService,
  ) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.subjects.forEach((subject$, id) => {
      subject$
        .pipe(
          this.monitors[id].monitorStart(),
          switchMap(which => {
            switch (which) {
              case 'trigger4xxMsApiResponse':
                return this.trigger4xxMsApiResponse$(id).pipe(this.monitors[id].monitorCatch());
              case 'trigger4xxUnknownResponse':
                return this.trigger4xxUnknownResponse$(id).pipe(this.monitors[id].monitorCatch());
              case 'trigger5xxMsApiResponse':
                return this.trigger5xxMsApiResponse$(id).pipe(this.monitors[id].monitorCatch());
              case 'trigger5xxUnknownResponse':
                return this.trigger5xxUnknownResponse$(id).pipe(this.monitors[id].monitorCatch());
              case 'triggerAngularException':
                return this.triggerAngularException$(id).pipe(this.monitors[id].monitorCatch());
              case 'triggerInternalException':
                return this.triggerInternalException$(id).pipe(this.monitors[id].monitorCatch());
              case 'triggerSuccess':
                return this.triggerSuccess$(id).pipe(this.monitors[id].monitorCatch());
            }
          }),
          this.monitors[id].monitorEnd(),
          takeUntil(this.onDestroy$),
        )
        .subscribe({
          next: r => (this.results[id] = r),
          error: err => (this.results[id] = err),
        });
    });

    this.activatedRoute.paramMap
      .pipe(
        map(paramMap => ({
          id: paramMap.has('id') ? paramMap.get('id') : null,
          which: paramMap.has('which') ? paramMap.get('which') : null,
        })),
        takeUntil(this.onDestroy$),
      )
      .subscribe(params => {
        this.id = params.id ? +params.id - 1 : null;
        switch (params.which as TWhich) {
          case 'trigger4xxMsApiResponse':
          case 'trigger4xxUnknownResponse':
          case 'trigger5xxMsApiResponse':
          case 'trigger5xxUnknownResponse':
          case 'triggerAngularException':
          case 'triggerInternalException':
          case 'triggerSuccess':
            this.expandRoutes = false;
            this.subjects[this.id].next(params.which as TWhich);
            break;
          default:
            this.which = 'unrecognized target: ' + params.which;
        }
      });
  }

  /** Produces a successful response for the given action monitor. */
  public triggerSuccess$(target: number): Observable<unknown> {
    if (this.disableToggles[target]) {
      return EMPTY;
    }
    return this.api.postRequest$(`v1/util/status/200?delay=${DELAY}`, { which: 'triggerSuccess' });
  }

  /** Produces a failure response for the given action monitor. */
  public triggerInternalException$(target: number): Observable<unknown> {
    if (this.disableToggles[target]) {
      return EMPTY;
    }
    return this.api
      .postRequest$(`v1/util/status/200?delay=${DELAY}`, { which: 'triggerInternalException' })
      .pipe(
        switchMap(() => {
          throw new Error('This is an internal error.');
        }),
      );
  }

  /** Produces a failure response for the given action monitor. */
  public triggerAngularException$(target: number): Observable<unknown> {
    if (this.disableToggles[target]) {
      return EMPTY;
    }
    return this.http.get('https://this.url.cant.exist');
  }

  /** Produces a failure response for the given action monitor. */
  public trigger4xxMsApiResponse$(target: number): Observable<unknown> {
    if (this.disableToggles[target]) {
      return EMPTY;
    }
    return this.api.postRequest$(`v1/util/status/400?delay=${DELAY}`, {
      error: 'triggerInternalException',
    });
  }

  /** Produces a failure response for the given action monitor. */
  public trigger4xxUnknownResponse$(target: number): Observable<unknown> {
    if (this.disableToggles[target]) {
      return EMPTY;
    }
    return this.api.postRequest$(`v1/util/status/400?delay=${DELAY}`, {
      which: 'triggerInternalException',
    });
  }

  /** Produces a failure response for the given action monitor. */
  public trigger5xxMsApiResponse$(target: number): Observable<unknown> {
    if (this.disableToggles[target]) {
      return EMPTY;
    }
    return this.api.postRequest$(`v1/util/status/500?delay=${DELAY}`, {
      error: 'triggerInternalException',
    });
  }

  /** Produces a failure response for the given action monitor. */
  public trigger5xxUnknownResponse$(target: number): Observable<unknown> {
    if (this.disableToggles[target]) {
      return EMPTY;
    }
    return this.api.postRequest$(`v1/util/status/500?delay=${DELAY}`, {
      which: 'triggerInternalException',
    });
  }
}
