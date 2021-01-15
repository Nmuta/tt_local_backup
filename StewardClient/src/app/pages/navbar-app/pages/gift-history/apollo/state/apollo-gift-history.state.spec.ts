import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { ApolloGiftHistoryState } from './apollo-gift-history.state';

describe('ApolloGiftHistoryState', () => {
  // let store: Store;
  let service: ApolloGiftHistoryState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([ApolloGiftHistoryState])],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(ApolloGiftHistoryState);
    // store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
