import { Injectable } from "@angular/core";
import { of } from "rxjs";

import { ApiService } from "./api.service";

/** Defines the mock for the API Service. */
@Injectable()
export class MockApiService {
  public getRequest = jasmine.createSpy("getRequest").and.returnValue(of({}));
  public postRequest = jasmine.createSpy("postRequest").and.returnValue(of({}));
  public putRequest = jasmine.createSpy("putRequest").and.returnValue(of({}));
  public deleteRequest = jasmine
    .createSpy("deleteRequest")
    .and.returnValue(of({}));
}

export function createMockApiService() {
  return {
    provide: ApiService,
    useValue: new MockApiService(),
  };
}
