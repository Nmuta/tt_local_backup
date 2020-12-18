import { TestBed } from '@angular/core/testing';

import { TitleMemoryRedirectGuard } from './title-memory-redirect.guard';

describe('TitleMemoryGuard', () => {
  let guard: TitleMemoryRedirectGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TitleMemoryRedirectGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
