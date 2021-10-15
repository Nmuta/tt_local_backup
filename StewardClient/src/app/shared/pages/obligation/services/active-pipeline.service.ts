import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

/** A services that stores some context data for a single Full Obligation Input form. */
@Injectable({ providedIn: 'any' })
export class ActivePipelineService {
  private _activityNames: string[] = [];

  /** Fired when a sync/GET is performed. */
  public readonly onSync$ = new Subject<void>();

  public readonly activityNames$: Observable<string[]> = new BehaviorSubject<string[]>(
    this._activityNames,
  );

  /** Sets the latest activity names. */
  public set activityNames(value: string[]) {
    this._activityNames = value;
    (this.activityNames$ as BehaviorSubject<string[]>).next(value);
  }

  /** Gets the latest activity names. */
  public get activityNames(): string[] {
    return this._activityNames;
  }
}
