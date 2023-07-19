import { Provider } from '@angular/core';
import _ from 'lodash';
import { defer, of } from 'rxjs';

import { ApiV2Service } from './api-v2.service';

/** Defines the mock for the API Service. */
export class MockApiV2Service {
  public getRequest$ = jasmine
    .createSpy('getRequest')
    .and.returnValue(defer(() => of(_.clone(this.generator()))));
  public postRequest$ = jasmine
    .createSpy('postRequest')
    .and.returnValue(defer(() => of(_.clone(this.generator()))));
  public putRequest$ = jasmine
    .createSpy('putRequest')
    .and.returnValue(defer(() => of(_.clone(this.generator()))));
  public deleteRequest$ = jasmine
    .createSpy('deleteRequest')
    .and.returnValue(defer(() => of(_.clone(this.generator()))));

  constructor(private readonly generator: () => unknown) {}
}

/** Creates an injectable mock for API Service. */
export function createMockApiV2Service(
  returnValueGenerator: () => unknown = () => new Object(),
): Provider {
  return {
    provide: ApiV2Service,
    useValue: new MockApiV2Service(returnValueGenerator),
  };
}
