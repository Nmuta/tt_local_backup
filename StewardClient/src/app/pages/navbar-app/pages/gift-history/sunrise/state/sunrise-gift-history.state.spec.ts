import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { SunriseGiftHistoryState } from './sunrise-gift-history.state';

describe('SunriseGiftHistoryState', () => {
  // let store: Store;
  let service: SunriseGiftHistoryState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([SunriseGiftHistoryState])],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(SunriseGiftHistoryState);
    // store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
