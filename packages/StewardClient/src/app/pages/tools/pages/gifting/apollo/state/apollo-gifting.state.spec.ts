import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { NgxsModule, Store } from '@ngxs/store';
import { GiftBasketModel } from '../../components/gift-basket/gift-basket.base.component';

import { ApolloGiftingState } from './apollo-gifting.state';
import {
  SetApolloGiftBasket,
  SetApolloGiftingMatTabIndex,
  SetApolloGiftingSelectedPlayerIdentities,
} from './apollo-gifting.state.actions';

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
    const selectedPlayerIdentities: IdentityResultAlpha = {
      query: { xuid: new BigNumber(0) },
      gamertag: 'test-gamertag',
    };
    let action;
    beforeEach(() => {
      action = new SetApolloGiftingSelectedPlayerIdentities([selectedPlayerIdentities]);
      store.reset({
        apolloGifting: {
          selectedPlayerIdentities: [],
        },
      });
    });
    it('should patch selected player identities', () => {
      store.dispatch(action);

      store
        .selectOnce(state => state.apolloGifting.selectedPlayerIdentities)
        .subscribe(data => {
          expect(data.length).toEqual(1);
          expect(data[0]).toEqual(selectedPlayerIdentities);
        });
    });
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
    it('should patch selected mat index', () => {
      store.dispatch(action);

      store
        .selectOnce(state => state.apolloGifting.selectedMatIndex)
        .subscribe(selectedMatIndex => {
          expect(selectedMatIndex).toEqual(1);
        });
    });
  });

  describe('[SetApolloGiftBasket] Action', () => {
    const testItemId = new BigNumber(12345);
    const giftBasket: GiftBasketModel[] = [
      {
        id: testItemId,
        description: 'test item',
        quantity: 20,
        itemType: 'test item type',
        edit: false,
        error: undefined,
      },
    ];
    let action;
    beforeEach(() => {
      action = new SetApolloGiftBasket(giftBasket);
      store.reset({
        apolloGifting: {
          giftBasket: [],
        },
      });
    });
    it('should patch gift basket', () => {
      store.dispatch(action);

      store
        .selectOnce(state => state.apolloGifting.giftBasket)
        .subscribe(data => {
          expect(data.length).toEqual(1);
          expect(data[0].id).toEqual(testItemId);
        });
    });
  });
});
