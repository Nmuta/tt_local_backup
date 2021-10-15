import { Injectable, Provider } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ObligationsService } from '.';
import faker from 'faker';

/** Defines the mock for the Obligation Service. */
@Injectable()
export class MockObligationsService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getAll$ = jasmine
    .createSpy('getAll')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public get$ = jasmine
    .createSpy('get')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));

  public put$ = jasmine
    .createSpy('put')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(faker.random.word()))));

  public post$ = jasmine
    .createSpy('post')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(faker.random.word()))));

  public create$ = jasmine
    .createSpy('create')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(faker.random.word()))));

  public delete$ = jasmine
    .createSpy('delete')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(faker.random.word()))));
}

/** Creates an injectable mock for Settings Service. */
export function createMockObligationsService(): Provider {
  return {
    provide: ObligationsService,
    useValue: new MockObligationsService(),
  };
}
