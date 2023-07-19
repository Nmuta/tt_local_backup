import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';

import { FakeApiInterceptor } from './fake-api.interceptor';

describe('FakeApiInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
      providers: [FakeApiInterceptor, createMockLoggerService()],
      schemas: [NO_ERRORS_SCHEMA],
    }),
  );

  it('should be created', () => {
    const interceptor: FakeApiInterceptor = TestBed.inject(FakeApiInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
