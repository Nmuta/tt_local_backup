import { TestBed } from '@angular/core/testing';

import { BigintInterceptor } from './bigint.interceptor';

describe('BigintInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      BigintInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: BigintInterceptor = TestBed.inject(BigintInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
