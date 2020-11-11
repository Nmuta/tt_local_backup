import { getTestBed, TestBed } from '@angular/core/testing';
import { ApolloPlayerGamertagDetailsFakeApi } from '@interceptors/fake-api/apis/title/apollo/player/gamertag/details';
import { Unprocessed } from '@models/unprocessed';
import { ApiService, createMockApiService } from '@services/api';

import * as faker from 'faker';
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
    });
    injector = getTestBed();
    service = injector.inject(ApolloService);
    apiServiceMock = injector.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Method: getPlayerDetailsByGamertag', () => {
    let expectedGamertag: string;

    beforeEach(() => {
      expectedGamertag = 'test-gamertag';
      nextReturnValue = {};
    });

    it('should call API service getRequest with the expected params', done => {
      service.getPlayerDetailsByGamertag(expectedGamertag).subscribe(res => {
        expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
          `${service.basePath}/player/gamertag(${expectedGamertag})/details`
        );
        done();
      });
    });
  });
});
