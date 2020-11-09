import { getTestBed, TestBed } from '@angular/core/testing';
import { OpusPlayerGamertagDetailsFakeApi } from '@interceptors/fake-api/apis/title/opus/player/gamertag/details';
import { ApiService, createMockApiService } from '@services/api';

import * as faker from 'faker';

import { OpusService } from './opus.service';

describe('OpusService', () => {
  let injector: TestBed;
  let service: OpusService;
  let apiServiceMock: ApiService;
  let nextReturnValue: object | [] = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [createMockApiService(() => nextReturnValue)],
    });
    injector = getTestBed();
    service = injector.inject(OpusService);
    apiServiceMock = injector.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('handles getPlayerDetailsByGamertag', done => {
    const typedReturnValue = (nextReturnValue = OpusPlayerGamertagDetailsFakeApi.make());
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
