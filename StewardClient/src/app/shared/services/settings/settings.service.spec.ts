import { NO_ERRORS_SCHEMA } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { ApiService, createMockApiService } from '@services/api';
import { of } from 'rxjs';

import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  let injector: TestBed;
  let service: SettingsService;
  let apiServiceMock: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [createMockApiService()],
      schemas: [NO_ERRORS_SCHEMA],
    });
    injector = getTestBed();
    service = injector.inject(SettingsService);
    apiServiceMock = injector.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Method: getLspEndpoints$', () => {
    beforeEach(() => {
      service.getLspEndpoints$ = jasmine.createSpy('getLspEndpoints$').and.returnValue(of([]));
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest').and.returnValue(of({}));
    });

    it('should call service.getPlayerIdentities$', done => {
      service.getLspEndpoints$().subscribe(() => {
        expect(service.getLspEndpoints$).toHaveBeenCalled();
        done();
      });
    });
  });
});
