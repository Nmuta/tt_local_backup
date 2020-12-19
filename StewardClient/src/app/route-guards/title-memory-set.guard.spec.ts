import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TitleMemorySetGuard } from './title-memory-set.guard';

describe('TitleMemorySetGuard', () => {
  let guard: TitleMemorySetGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
    });
    guard = TestBed.inject(TitleMemorySetGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
