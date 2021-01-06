import { HttpHeaders } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { Unprocessed } from '@models/unprocessed';
import { ApiService, createMockApiService } from '@services/api';
import { of } from 'rxjs';

import { ApolloService } from './apollo.service';

describe('ApolloService', () => {
  let injector: TestBed;
  let service: ApolloService;
  let apiServiceMock: ApiService;
  let nextReturnValue: Unprocessed<unknown> = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [createMockApiService(() => nextReturnValue)],
      schemas: [NO_ERRORS_SCHEMA],
    });
    injector = getTestBed();
    service = injector.inject(ApolloService);
    apiServiceMock = injector.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Method: getPlayerIdentity', () => {
    beforeEach(() => {
      service.getPlayerIdentities = jasmine
        .createSpy('getPlayerIdentities')
        .and.returnValue(of([]));
      apiServiceMock.getRequest = jasmine.createSpy('getRequest').and.returnValue(of({}));
    });

    it('should call service.getPlayerIdentities', done => {
      service.getPlayerIdentity({} as any).subscribe(() => {
        expect(service.getPlayerIdentities).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('Method: getPlayerIdentities', () => {
    beforeEach(() => {
      apiServiceMock.postRequest = jasmine.createSpy('postRequest').and.returnValue(of([]));
    });

    it('should call apiServiceMock.postRequest', done => {
      service.getPlayerIdentities([] as any).subscribe(() => {
        expect(apiServiceMock.postRequest).toHaveBeenCalledWith(
          `${service.basePath}/players/identities`,
          jasmine.any(Object),
          null,
          jasmine.any(HttpHeaders),
        );
        done();
      });
    });
  });

  describe('Method: getPlayerDetailsByGamertag', () => {
    let expectedGamertag: string;

    beforeEach(() => {
      expectedGamertag = 'test-gamertag';
      nextReturnValue = {};
    });

    it('should call API service getRequest with the expected params', done => {
      service.getPlayerDetailsByGamertag(expectedGamertag).subscribe(() => {
        expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
          `${service.basePath}/player/gamertag(${expectedGamertag})/details`,
        );
        done();
      });
    });
  });
});
