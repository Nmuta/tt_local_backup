import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { FakeApiInterceptor } from './fake-api.interceptor';

describe('FakeApiInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
      providers: [FakeApiInterceptor],
    }),
  );

  it('should be created', () => {
    const interceptor: FakeApiInterceptor = TestBed.inject(FakeApiInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
