import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { NgxsModule, Store } from '@ngxs/store';
import { GiftBasketModel } from '../../components/gift-basket/gift-basket.base.component';
import { WoodstockGiftingState } from './woodstock-gifting.state';
import {
  SetWoodstockGiftBasket,
  SetWoodstockGiftingMatTabIndex,
  SetWoodstockGiftingSelectedPlayerIdentities,
} from './woodstock-gifting.state.actions';

describe('WoodstockGiftingState', () => {
  let service: WoodstockGiftingState;
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([WoodstockGiftingState])],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(WoodstockGiftingState);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('[SetWoodstockGiftingMatTabIndex] Action', () => {
    const selectedMatIndex: number = 1;
    let action;
    beforeEach(() => {
      action = new SetWoodstockGiftingMatTabIndex(selectedMatIndex);
      store.reset({
        woodstockGifting: {
          selectedMatIndex: 0,
        },
      });
    });
    it('should patch selected mat index', () => {
      store.dispatch(action);

      store
        .selectOnce(state => state.woodstockGifting.selectedMatIndex)
        .subscribe(selectedMatIndex => {
          expect(selectedMatIndex).toEqual(1);
        });
    });
  });

  describe('[SetWoodstockGiftingSelectedPlayerIdentities] Action', () => {
    const selectedPlayerIdentities: IdentityResultAlpha = {
      query: { xuid: new BigNumber(0) },
      gamertag: 'test-gamertag',
    };
    let action;
    beforeEach(() => {
      action = new SetWoodstockGiftingSelectedPlayerIdentities([selectedPlayerIdentities]);
      store.reset({
        woodstockGifting: {
          selectedPlayerIdentities: [],
        },
      });
    });
    it('should patch selected player identities', () => {
      store.dispatch(action);

      store
        .selectOnce(state => state.woodstockGifting.selectedPlayerIdentities)
        .subscribe(data => {
          expect(data.length).toEqual(1);
          expect(data[0]).toEqual(selectedPlayerIdentities);
        });
    });
  });

  describe('[SetWoodstockGiftBasket] Action', () => {
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
      action = new SetWoodstockGiftBasket(giftBasket);
      store.reset({
        woodstockGifting: {
          giftBasket: [],
        },
      });
    });
    it('should patch gift basket', () => {
      store.dispatch(action);

      store
        .selectOnce(state => state.woodstockGifting.giftBasket)
        .subscribe(data => {
          expect(data.length).toEqual(1);
          expect(data[0].id).toEqual(testItemId);
        });
    });
  });
});
