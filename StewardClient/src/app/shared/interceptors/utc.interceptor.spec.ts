import { TestBed } from '@angular/core/testing';

import { UtcInterceptor } from './utc.interceptor';

describe('UtcInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      UtcInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: UtcInterceptor = TestBed.inject(UtcInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
