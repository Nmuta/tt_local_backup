import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { GiftBasketModel } from '@models/master-inventory-item';
import { SetSunriseGiftHistorySelectedPlayerIdentities } from '@navbar-app/pages/gift-history/sunrise/state/sunrise-gift-history.state.actions';
import { NgxsModule, Store } from '@ngxs/store';
import { SunriseGiftingState } from './sunrise-gifting.state';
import {
  SetSunriseGiftBasket,
  SetSunriseGiftingMatTabIndex,
  SetSunriseGiftingSelectedPlayerIdentities,
} from './sunrise-gifting.state.actions';

describe('SunriseGiftingState', () => {
  let service: SunriseGiftingState;
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([SunriseGiftingState])],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(SunriseGiftingState);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('[SetSunriseGiftingMatTabIndex] Action', () => {
    const selectedMatIndex: number = 1;
    let action;
    beforeEach(() => {
      action = new SetSunriseGiftingMatTabIndex(selectedMatIndex);
      store.reset({
        sunriseGifting: {
          selectedMatIndex: 0,
        },
      });
    });
    it('should patch selected mat index', () => {
      store.dispatch(action);

      store
        .selectOnce(state => state.sunriseGifting.selectedMatIndex)
        .subscribe(selectedMatIndex => {
          expect(selectedMatIndex).toEqual(1);
        });
    });
  });

  describe('[SetSunriseGiftingSelectedPlayerIdentities] Action', () => {
    const selectedPlayerIdentities: IdentityResultAlpha = {
      query: { xuid: BigInt(0) },
      gamertag: 'test-gamertag',
    };
    let action;
    beforeEach(() => {
      action = new SetSunriseGiftingSelectedPlayerIdentities([selectedPlayerIdentities]);
      store.reset({
        sunriseGifting: {
          selectedPlayerIdentities: [],
        },
      });
    });
    it('should patch selected player identities', () => {
      store.dispatch(action);

      store
        .selectOnce(state => state.sunriseGifting.selectedPlayerIdentities)
        .subscribe(data => {
          expect(data.length).toEqual(1);
          expect(data[0]).toEqual(selectedPlayerIdentities);
        });
    });
  });

  describe('[SetSunriseGiftBasket] Action', () => {
    const testItemId = BigInt(12345);
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
      action = new SetSunriseGiftBasket(giftBasket);
      store.reset({
        sunriseGifting: {
          giftBasket: [],
        },
      });
    });
    it('should patch gift basket', () => {
      store.dispatch(action);

      store
        .selectOnce(state => state.sunriseGifting.giftBasket)
        .subscribe(data => {
          expect(data.length).toEqual(1);
          expect(data[0].id).toEqual(testItemId);
        });
    });
  });
});
