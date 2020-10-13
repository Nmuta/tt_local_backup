import { TestBed, getTestBed, inject } from '@angular/core/testing';
import { ApiService, createMockApiService } from '@shared/services/api';
import { of } from 'rxjs';
import { GravityService } from './gravity.service';

describe('service: ApiService', () => {
  let injector: TestBed;
  let service: GravityService;
  let apiServiceMock: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ApiService, createMockApiService()],
    });
    injector = getTestBed();
    service = injector.inject(GravityService);
    apiServiceMock = injector.inject(ApiService);
  });

  describe('Method: getPlayerDetailsByGamertag', () => {
    var expectedGamertag;
    beforeEach(() => {
      expectedGamertag = 'test-gamertag';
      apiServiceMock.getRequest = jasmine
        .createSpy('getRequest')
        .and.returnValue(of({}));
    });
    it('should call API service getRequest with the expected params', done => {
      service.getPlayerDetailsByGamertag(expectedGamertag).subscribe(res => {
        expect(apiServiceMock.getRequest).toHaveBeenCalledWith(
          `${service.basePath}/player/details/gamertag(${expectedGamertag})`
        );
        done();
      });
    });
  });
});
