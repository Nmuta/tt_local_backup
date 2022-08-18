import { NO_ERRORS_SCHEMA } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import faker from '@faker-js/faker';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { createMockApiV2Service } from '@services/api-v2/api-v2.service.mock';
import { of } from 'rxjs';
import { SteelheadProfileTemplatesService } from './steelhead-profile-templates.service';

describe('SteelheadProfileTemplatesService', () => {
  let service: SteelheadProfileTemplatesService;
  let apiServiceMock: ApiV2Service;
  const nextReturnValue: unknown = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [createMockApiV2Service(() => nextReturnValue)],
      schemas: [NO_ERRORS_SCHEMA],
    });
    const injector = getTestBed();
    service = injector.inject(SteelheadProfileTemplatesService);
    apiServiceMock = injector.inject(ApiV2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Method: saveProfileTemplateTemplate', () => {
    const mockResponse = Array(10).map(() => faker.random.word());

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine
        .createSpy('getRequest')
        .and.returnValue(of(mockResponse));
    });

    it('should call service.getRequest$ with correct params', done => {
      service.getProfileTemplates$().subscribe(response => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(service.basePath);

        expect(response).toEqual(mockResponse);
        done();
      });
    });
  });
});
