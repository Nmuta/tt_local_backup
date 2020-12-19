import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TitleMemoryRedirectGuard } from './title-memory-redirect.guard';

describe('TitleMemoryGuard', () => {
  let guard: TitleMemoryRedirectGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
    });
    guard = TestBed.inject(TitleMemoryRedirectGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
