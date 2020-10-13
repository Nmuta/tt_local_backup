import { TestBed, getTestBed, inject } from '@angular/core/testing';
import { ApiService, createMockApiService } from '@shared/services/api';
import { GravityService } from './gravity.service';

describe('service: ApiService', () => {
  let injector: TestBed;
  let gravityService: GravityService;
  let apiServiceMock: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ApiService,
        createMockApiService()
      ],
      
    });
    injector = getTestBed();
    gravityService = injector.inject(GravityService);
    apiServiceMock = injector.inject(ApiService);
  });
});
