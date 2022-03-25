import { NO_ERRORS_SCHEMA } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { KustoQuery } from '@models/kusto';
import { ApiService, createMockApiService } from '@services/api';
import { of } from 'rxjs';
import { KustoService } from './kusto.service';
import faker from '@faker-js/faker';
import { GameTitleCodeName } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';

describe('KustoService', () => {
  let injector: TestBed;
  let service: KustoService;

  let apiServiceMock: ApiService;
  const nextReturnValue: unknown = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [createMockApiService(() => nextReturnValue)],
      schemas: [NO_ERRORS_SCHEMA],
    });

    injector = getTestBed();
    service = injector.inject(KustoService);
    apiServiceMock = injector.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Method: getKustoQueries', () => {
    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest').and.returnValue(of({}));
    });

    it('should call apiService.getRequest', done => {
      service.getKustoQueries$().subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(`${service.basePath}/queries`);
        done();
      });
    });
  });

  describe('Method: postRunKustoQuery', () => {
    const queryString = 'test-query-string';

    beforeEach(() => {
      apiServiceMock.postRequest$ = jasmine.createSpy('postRequest').and.returnValue(of({}));
    });

    it('should call apiService.postRequest', done => {
      service.postRunKustoQuery$(queryString).subscribe(() => {
        expect(apiServiceMock.postRequest$).toHaveBeenCalledWith(
          `${service.basePath}/query/run`,
          queryString,
        );
        done();
      });
    });
  });

  describe('Method: postSaveNewKustoQuery', () => {
    const query: KustoQuery = {
      id: faker.datatype.uuid(),
      name: 'Test Kusto Query',
      title: GameTitleCodeName.Street,
      query: faker.random.words(10),
    };

    beforeEach(() => {
      apiServiceMock.postRequest$ = jasmine.createSpy('postRequest').and.returnValue(of({}));
    });

    it('should call apiService.postRequest', done => {
      service.postSaveNewKustoQuery$(query).subscribe(() => {
        expect(apiServiceMock.postRequest$).toHaveBeenCalledWith(`${service.basePath}/queries`, [
          query,
        ]);
        done();
      });
    });
  });

  describe('Method: putReplaceKustoQuery', () => {
    const query: KustoQuery = {
      id: undefined,
      name: 'Test Kusto Query',
      title: GameTitleCodeName.Street,
      query: faker.random.words(10),
    };
    const queryEditId: GuidLikeString = faker.datatype.uuid();

    beforeEach(() => {
      apiServiceMock.putRequest$ = jasmine.createSpy('putRequest').and.returnValue(of({}));
    });

    it('should call apiService.putRequest', done => {
      service.putReplaceKustoQuery$(queryEditId, query).subscribe(() => {
        expect(apiServiceMock.putRequest$).toHaveBeenCalledWith(
          `${service.basePath}/queries/id(${queryEditId})`,
          query,
        );
        done();
      });
    });
  });

  describe('Method: deleteKustoQuery', () => {
    const query: KustoQuery = {
      id: faker.datatype.uuid(),
      name: 'Test Kusto Query',
      title: GameTitleCodeName.Street,
      query: faker.random.words(10),
    };

    beforeEach(() => {
      apiServiceMock.deleteRequest$ = jasmine.createSpy('deleteRequest').and.returnValue(of({}));
    });

    it('should call apiService.deleteRequest', done => {
      service.deleteKustoQuery$(query.id).subscribe(() => {
        expect(apiServiceMock.deleteRequest$).toHaveBeenCalledWith(
          `${service.basePath}/queries/id(${query.id})`,
        );
        done();
      });
    });
  });
});
