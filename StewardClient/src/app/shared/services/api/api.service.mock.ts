import { Injectable } from '@angular/core';
import _ from 'lodash';
import { defer, of } from 'rxjs';

import { ApiService } from './api.service';

/** Defines the mock for the API Service. */
@Injectable()
export class MockApiService {
  public getRequest = jasmine
    .createSpy('getRequest')
    .and.returnValue(defer(() => of(_.clone(this.generator()))));
  public postRequest = jasmine
    .createSpy('postRequest')
    .and.returnValue(defer(() => of(_.clone(this.generator()))));
  public putRequest = jasmine
    .createSpy('putRequest')
    .and.returnValue(defer(() => of(_.clone(this.generator()))));
  public deleteRequest = jasmine
    .createSpy('deleteRequest')
    .and.returnValue(defer(() => of(_.clone(this.generator()))));

  constructor(private readonly generator: () => any) {}
}

export function createMockApiService(
  returnValueGenerator: () => any = () => new Object()
) {
  return {
    provide: ApiService,
    useValue: new MockApiService(returnValueGenerator),
  };
}
