import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';

import { ApolloGiftingState } from '../apollo-gifting.state';
import { SetApolloGiftingMatTabIndex } from '../apollo-gifting.state.actions';

describe('ApolloGiftingState', () => {
  let service: ApolloGiftingState;
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([ApolloGiftingState])],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(ApolloGiftingState);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('[SetApolloGiftingSelectedPlayerIdentities] Action', () => {
    const selectedMatIndex: number = 1;
    let action;
    beforeEach(() => {
      action = new SetApolloGiftingMatTabIndex(selectedMatIndex);
      store.reset({
        apolloGifting: {
          selectedMatIndex: 0,
        },
      });
    });
    it('should patch access token to undefined', () => {
      // Action
      store.dispatch(action);

      // Assert
      store
        .selectOnce(state => state.apolloGifting.selectedMatIndex)
        .subscribe(selectedMatIndex => {
          expect(selectedMatIndex).toEqual(1);
        });
    });
  });
});
