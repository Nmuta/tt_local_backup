import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { NgxsModule, Store } from '@ngxs/store';
import { GiftBasketModel } from '../../components/gift-basket/gift-basket.base.component';

import { SteelheadGiftingState } from './steelhead-gifting.state';
import {
  SetSteelheadGiftBasket,
  SetSteelheadGiftingMatTabIndex,
  SetSteelheadGiftingSelectedPlayerIdentities,
} from './steelhead-gifting.state.actions';

describe('SteelheadGiftingState', () => {
  let service: SteelheadGiftingState;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([SteelheadGiftingState])],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(SteelheadGiftingState);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('[SetSteelheadGiftingSelectedPlayerIdentities] Action', () => {
    const selectedPlayerIdentities: IdentityResultAlpha = {
      query: { xuid: new BigNumber(0) },
      gamertag: 'test-gamertag',
    };
    let action;
    beforeEach(() => {
      action = new SetSteelheadGiftingSelectedPlayerIdentities([selectedPlayerIdentities]);
      store.reset({
        steelheadGifting: {
          selectedPlayerIdentities: [],
        },
      });
    });
    it('should patch selected player identities', () => {
      store.dispatch(action);

      store
        .selectOnce(state => state.steelheadGifting.selectedPlayerIdentities)
        .subscribe(data => {
          expect(data.length).toEqual(1);
          expect(data[0]).toEqual(selectedPlayerIdentities);
        });
    });
  });

  describe('[SetSteelheadGiftingSelectedPlayerIdentities] Action', () => {
    const selectedMatIndex: number = 1;
    let action;
    beforeEach(() => {
      action = new SetSteelheadGiftingMatTabIndex(selectedMatIndex);
      store.reset({
        steelheadGifting: {
          selectedMatIndex: 0,
        },
      });
    });
    it('should patch selected mat index', () => {
      store.dispatch(action);

      store
        .selectOnce(state => state.steelheadGifting.selectedMatIndex)
        .subscribe(selectedMatIndex => {
          expect(selectedMatIndex).toEqual(1);
        });
    });
  });

  describe('[SetSteelheadGiftBasket] Action', () => {
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
      action = new SetSteelheadGiftBasket(giftBasket);
      store.reset({
        steelheadGifting: {
          giftBasket: [],
        },
      });
    });
    it('should patch gift basket', () => {
      store.dispatch(action);

      store
        .selectOnce(state => state.steelheadGifting.giftBasket)
        .subscribe(data => {
          expect(data.length).toEqual(1);
          expect(data[0].id).toEqual(testItemId);
        });
    });
  });
});
