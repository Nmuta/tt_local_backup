import { NO_ERRORS_SCHEMA } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { faker } from '@interceptors/fake-api/utility';
import { ApiService, createMockApiService } from '@services/api';
import { ObligationsService } from './obligations.service';
import { PipelineGetFakeApi } from '@interceptors/fake-api/apis/pipeline/get';

describe('ObligationsService', () => {
  let injector: TestBed;
  let service: ObligationsService;
  let apiServiceMock: ApiService;
  let nextReturnValue: unknown = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [createMockApiService(() => nextReturnValue)],
      schemas: [NO_ERRORS_SCHEMA],
    });
    injector = getTestBed();
    service = injector.inject(ObligationsService);
    apiServiceMock = injector.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('handles put', done => {
    service.put$(PipelineGetFakeApi.make(faker.datatype.uuid())).subscribe(output => {
      expect(output as unknown).toEqual(
        nextReturnValue as unknown,
        'fields should not be modified',
      );
      done();
    });
  });

  it('handles post', done => {
    service.post$(PipelineGetFakeApi.make(faker.datatype.uuid())).subscribe(output => {
      expect(output as unknown).toEqual(
        nextReturnValue as unknown,
        'fields should not be modified',
      );
      done();
    });
  });

  it('handles delete', done => {
    service.delete$(faker.datatype.uuid()).subscribe(output => {
      expect(output as unknown).toEqual(
        nextReturnValue as unknown,
        'fields should not be modified',
      );
      done();
    });
  });

  describe('Method: get$', () => {
    const identifier = faker.datatype.uuid();

    beforeEach(() => {
      nextReturnValue = PipelineGetFakeApi.make(identifier);
    });

    it('completes', done => {
      service.get$(identifier).subscribe(output => {
        expect(output as unknown).toEqual(
          nextReturnValue as unknown,
          'fields should not be modified',
        );
        done();
      });
    });

    it('should call apiServiceMock.getRequest', done => {
      service.get$(identifier).subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/${identifier}`,
        );
        done();
      });
    });
  });

  describe('Method: put$', () => {
    const identifier = faker.datatype.uuid();
    const payload = PipelineGetFakeApi.make(identifier);

    beforeEach(() => {
      nextReturnValue = faker.datatype.uuid();
    });

    it('completes', done => {
      service.put$(payload).subscribe(output => {
        expect(output as unknown).toEqual(
          nextReturnValue as unknown,
          'fields should not be modified',
        );
        done();
      });
    });

    it('should call apiServiceMock.putRequest', done => {
      service.put$(payload).subscribe(() => {
        expect(apiServiceMock.putRequest$).toHaveBeenCalledWith(`${service.basePath}`, payload);
        done();
      });
    });
  });

  describe('Method: post$', () => {
    const identifier = faker.datatype.uuid();
    const payload = PipelineGetFakeApi.make(identifier);

    beforeEach(() => {
      nextReturnValue = faker.datatype.uuid();
    });

    it('completes', done => {
      service.post$(payload).subscribe(output => {
        expect(output as unknown).toEqual(
          nextReturnValue as unknown,
          'fields should not be modified',
        );
        done();
      });
    });

    it('should call apiServiceMock.postRequest', done => {
      service.post$(payload).subscribe(() => {
        expect(apiServiceMock.postRequest$).toHaveBeenCalledWith(`${service.basePath}`, payload);
        done();
      });
    });
  });

  describe('Method: delete$', () => {
    const identifier = faker.datatype.uuid();

    beforeEach(() => {
      nextReturnValue = faker.datatype.uuid();
    });

    it('completes', done => {
      service.delete$(identifier).subscribe(output => {
        expect(output as unknown).toEqual(
          nextReturnValue as unknown,
          'fields should not be modified',
        );
        done();
      });
    });

    it('should call apiServiceMock.deleteRequest', done => {
      service.delete$(identifier).subscribe(() => {
        expect(apiServiceMock.deleteRequest$).toHaveBeenCalledWith(
          `${service.basePath}/${identifier}`,
        );
        done();
      });
    });
  });
});
