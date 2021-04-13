import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IdentityResultBeta } from '@models/identity-query.model';
import { NgxsModule, Store } from '@ngxs/store';
import { GiftBasketModel } from '../../components/gift-basket/gift-basket.base.component';
import { GravityGiftingState } from './gravity-gifting.state';
import {
  SetGravityGiftBasket,
  SetGravitySelectedPlayerIdentities,
} from './gravity-gifting.state.actions';

describe('GravityGiftingState', () => {
  let service: GravityGiftingState;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([GravityGiftingState])],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(GravityGiftingState);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('[SetGravitySelectedPlayerIdentities] Action', () => {
    const selectedPlayerIdentities: IdentityResultBeta = {
      query: { xuid: new BigNumber(0) },
      gamertag: 'test-gamertag',
    };
    let action;
    beforeEach(() => {
      action = new SetGravitySelectedPlayerIdentities([selectedPlayerIdentities]);
      store.reset({
        gravityGifting: {
          selectedPlayerIdentities: [],
        },
      });
    });
    it('should patch selected player identities', () => {
      store.dispatch(action);

      store
        .selectOnce(state => state.gravityGifting.selectedPlayerIdentities)
        .subscribe(data => {
          expect(data.length).toEqual(1);
          expect(data[0]).toEqual(selectedPlayerIdentities);
        });
    });
  });

  describe('[SetGravityGiftBasket] Action', () => {
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
      action = new SetGravityGiftBasket(giftBasket);
      store.reset({
        gravityGifting: {
          giftBasket: [],
        },
      });
    });
    it('should patch gift basket', () => {
      store.dispatch(action);

      store
        .selectOnce(state => state.gravityGifting.giftBasket)
        .subscribe(data => {
          expect(data.length).toEqual(1);
          expect(data[0].id).toEqual(testItemId);
        });
    });
  });
});
