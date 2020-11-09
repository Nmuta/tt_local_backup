import { getTestBed, TestBed } from '@angular/core/testing';
import { ApolloPlayerGamertagDetailsFakeApi } from '@interceptors/fake-api/apis/title/apollo/player/gamertag/details';
import { ApiService, createMockApiService } from '@services/api';

import * as faker from 'faker';

import { ApolloService } from './apollo.service';

describe('ApolloService', () => {
  let injector: TestBed;
  let service: ApolloService;
  let apiServiceMock: ApiService;
  let nextReturnValue: object | [] = {};

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

  it('handles getPlayerDetailsByGamertag', done => {
    const typedReturnValue = (nextReturnValue = ApolloPlayerGamertagDetailsFakeApi.make());
    service
      .getPlayerDetailsByGamertag(typedReturnValue.gamertag)
      .subscribe(output => {
        expect(output).toEqual(
          nextReturnValue as any,
          'fields should not be modified'
        );
        done();
      });
  });
});
