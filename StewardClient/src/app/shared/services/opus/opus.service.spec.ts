import { getTestBed, TestBed } from '@angular/core/testing';
import { OpusPlayerGamertagDetailsFakeApi } from '@interceptors/fake-api/apis/title/opus/player/gamertag/details';
import { ApiService, createMockApiService } from '@services/api';

import * as faker from 'faker';
import { of } from 'rxjs';

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

  describe('Method: getPlayerDetailsByGamertag', () => {
    let expectedGamertag;

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
