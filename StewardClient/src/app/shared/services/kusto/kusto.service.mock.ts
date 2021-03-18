import { Injectable, Provider } from '@angular/core';
import { KustoGetQueriesFakeApi } from '@interceptors/fake-api/apis/kusto/queries';
import { KustoRunQueryFakeApi } from '@interceptors/fake-api/apis/kusto/run';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { KustoService } from './kusto.service';

/** Defines the mock for the Kusto Service. */
@Injectable()
export class MockKustoService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getKustoQueries = jasmine
    .createSpy('getKustoQueries')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(KustoGetQueriesFakeApi.make()))));

  public postRunKustoQuery = jasmine
    .createSpy('postRunKustoQuery')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(KustoRunQueryFakeApi.make()))));
}

/** Creates an injectable mock for Kusto Service. */
export function createMockKustoService(): Provider {
  return {
    provide: KustoService,
    useValue: new MockKustoService(),
  };
}
