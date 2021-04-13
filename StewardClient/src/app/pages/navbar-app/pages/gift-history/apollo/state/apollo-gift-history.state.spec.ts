import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { NgxsModule, Store } from '@ngxs/store';
import { ApolloGiftHistoryState } from './apollo-gift-history.state';
import {
  SetApolloGiftHistoryMatTabIndex,
  SetApolloGiftHistorySelectedPlayerIdentities,
} from './apollo-gift-history.state.actions';

describe('ApolloGiftHistoryState', () => {
  let store: Store;
  let service: ApolloGiftHistoryState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([ApolloGiftHistoryState])],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(ApolloGiftHistoryState);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('[SetApolloGiftHistorySelectedPlayerIdentities] Action', () => {
    const selectedPlayerIdentities: IdentityResultAlpha = {
      query: { xuid: new BigNumber(0) },
      gamertag: 'test-gamertag',
    };

    let action;
    beforeEach(() => {
      action = new SetApolloGiftHistorySelectedPlayerIdentities([selectedPlayerIdentities]);
      store.reset({
        apolloGiftHistory: {
          selectedPlayerIdentities: [],
        },
      });
    });

    it('should patch selected player identities', () => {
      store.dispatch(action);

      store
        .selectOnce(state => state.apolloGiftHistory.selectedPlayerIdentities)
        .subscribe(data => {
          expect(data.length).toEqual(1);
          expect(data[0]).toEqual(selectedPlayerIdentities);
        });
    });
  });

  describe('[SetApolloGiftHistorySelectedPlayerIdentities] Action', () => {
    const selectedMatIndex: number = 1;
    let action;
    beforeEach(() => {
      action = new SetApolloGiftHistoryMatTabIndex(selectedMatIndex);
      store.reset({
        apolloGiftHistory: {
          selectedMatIndex: 0,
        },
      });
    });

    it('should patch selected mat index', () => {
      store.dispatch(action);

      store
        .selectOnce(state => state.apolloGiftHistory.selectedMatIndex)
        .subscribe(selectedMatIndex => {
          expect(selectedMatIndex).toEqual(1);
        });
    });
  });
});
