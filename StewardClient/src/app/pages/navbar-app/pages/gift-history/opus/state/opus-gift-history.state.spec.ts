import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { OpusGiftHistoryState } from './opus-gift-history.state';

describe('OpusGiftHistoryState', () => {
  // let store: Store;
  let service: OpusGiftHistoryState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([OpusGiftHistoryState])],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(OpusGiftHistoryState);
    // store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
