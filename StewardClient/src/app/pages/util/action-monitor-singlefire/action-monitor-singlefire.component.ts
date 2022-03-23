import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ApiService } from '@services/api';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { clone } from 'lodash';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const DELAY = 10_000; /*ms*/

/**
 * A demo component for action monitors (singlefire).
 */
@Component({
  templateUrl: './action-monitor-singlefire.component.html',
  styleUrls: ['./action-monitor-singlefire.component.scss'],
})
export class ActionMonitorSinglefireComponent {
  public disableToggles: boolean[] = [false, false, false];

  public monitors: ActionMonitor[] = [
    new ActionMonitor('Monitor 1'),
    new ActionMonitor('Monitor 2'),
    new ActionMonitor('Monitor 3'),
  ];

  public results: unknown[] = [undefined, undefined, undefined];

  constructor(private readonly http: HttpClient, private readonly api: ApiService) {}

  /** Produces a successful response for the given action monitor. */
  public async triggerSuccess(target: number): Promise<void> {
    if (this.disableToggles[target]) {
      return;
    }
    const monitor = await this.refreshMonitor(target);
    this.api
      .postRequest$(`v1/util/status/200?delay=${DELAY}`, { which: 'triggerSuccess' })
      .pipe(monitor.monitorSingleFire())
      .subscribe(r => (this.results[target] = r));
  }

  /** Produces a failure response for the given action monitor. */
  public async triggerInternalException(target: number): Promise<void> {
    if (this.disableToggles[target]) {
      return;
    }
    const monitor = await this.refreshMonitor(target);
    this.api
      .postRequest$(`v1/util/status/200?delay=${DELAY}`, { which: 'triggerInternalException' })
      .pipe(
        switchMap(() => {
          throw new Error('This is an internal error.');
        }),
        monitor.monitorSingleFire(),
      )
      .subscribe({
        next: r => (this.results[target] = r),
        error: err => (this.results[target] = err),
      });
  }

  /** Produces a failure response for the given action monitor. */
  public async triggerAngularException(target: number): Promise<void> {
    if (this.disableToggles[target]) {
      return;
    }
    const monitor = await this.refreshMonitor(target);
    this.http
      .get('https://this.url.cant.exist')
      .pipe(monitor.monitorSingleFire())
      .subscribe({
        next: r => (this.results[target] = r),
        error: err => (this.results[target] = err),
      });
  }

  /** Produces a failure response for the given action monitor. */
  public async trigger4xxMsApiResponse(target: number): Promise<void> {
    if (this.disableToggles[target]) {
      return;
    }
    const monitor = await this.refreshMonitor(target);
    this.api
      .postRequest$(`v1/util/status/400?delay=${DELAY}`, { error: 'triggerInternalException' })
      .pipe(monitor.monitorSingleFire())
      .subscribe({
        next: r => (this.results[target] = r),
        error: err => (this.results[target] = err),
      });
  }

  /** Produces a failure response for the given action monitor. */
  public async trigger4xxUnknownResponse(target: number): Promise<void> {
    if (this.disableToggles[target]) {
      return;
    }
    const monitor = await this.refreshMonitor(target);
    this.api
      .postRequest$(`v1/util/status/400?delay=${DELAY}`, { which: 'triggerInternalException' })
      .pipe(monitor.monitorSingleFire())
      .subscribe({
        next: r => (this.results[target] = r),
        error: err => (this.results[target] = err),
      });
  }

  /** Produces a failure response for the given action monitor. */
  public async trigger5xxMsApiResponse(target: number): Promise<void> {
    if (this.disableToggles[target]) {
      return;
    }
    const monitor = await this.refreshMonitor(target);
    this.api
      .postRequest$(`v1/util/status/500?delay=${DELAY}`, { error: 'triggerInternalException' })
      .pipe(monitor.monitorSingleFire())
      .subscribe({
        next: r => (this.results[target] = r),
        error: err => (this.results[target] = err),
      });
  }

  /** Produces a failure response for the given action monitor. */
  public async trigger5xxUnknownResponse(target: number): Promise<void> {
    if (this.disableToggles[target]) {
      return;
    }
    const monitor = await this.refreshMonitor(target);
    this.api
      .postRequest$(`v1/util/status/500?delay=${DELAY}`, { which: 'triggerInternalException' })
      .pipe(monitor.monitorSingleFire())
      .subscribe({
        next: r => (this.results[target] = r),
        error: err => (this.results[target] = err),
      });
  }

  private async refreshMonitor(target: number): Promise<ActionMonitor> {
    await timer(0).toPromise(); // must wait until between render steps to update this value.
    const tempMonitors = clone(this.monitors);
    tempMonitors[target] = this.monitors[target].repeat();
    this.monitors = tempMonitors;
    return this.monitors[target];
  }
}
