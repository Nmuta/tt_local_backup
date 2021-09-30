import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { NgxsModule, Store } from '@ngxs/store';
import { SteelheadGiftHistoryState } from './steelhead-gift-history.state';
import {
  SetSteelheadGiftHistoryMatTabIndex,
  SetSteelheadGiftHistorySelectedPlayerIdentities,
} from './steelhead-gift-history.state.actions';

describe('SteelheadGiftHistoryState', () => {
  let store: Store;
  let service: SteelheadGiftHistoryState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([SteelheadGiftHistoryState])],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(SteelheadGiftHistoryState);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('[SetSteelheadGiftHistorySelectedPlayerIdentities] Action', () => {
    const selectedPlayerIdentities: IdentityResultAlpha = {
      query: { xuid: new BigNumber(0) },
      gamertag: 'test-gamertag',
    };

    let action;
    beforeEach(() => {
      action = new SetSteelheadGiftHistorySelectedPlayerIdentities([selectedPlayerIdentities]);
      store.reset({
        steelheadGiftHistory: {
          selectedPlayerIdentities: [],
        },
      });
    });

    it('should patch selected player identities', () => {
      store.dispatch(action);

      store
        .selectOnce(state => state.steelheadGiftHistory.selectedPlayerIdentities)
        .subscribe(data => {
          expect(data.length).toEqual(1);
          expect(data[0]).toEqual(selectedPlayerIdentities);
        });
    });
  });

  describe('[SetSteelheadGiftHistorySelectedPlayerIdentities] Action', () => {
    const selectedMatIndex: number = 1;
    let action;
    beforeEach(() => {
      action = new SetSteelheadGiftHistoryMatTabIndex(selectedMatIndex);
      store.reset({
        steelheadGiftHistory: {
          selectedMatIndex: 0,
        },
      });
    });

    it('should patch selected mat index', () => {
      store.dispatch(action);

      store
        .selectOnce(state => state.steelheadGiftHistory.selectedMatIndex)
        .subscribe(selectedMatIndex => {
          expect(selectedMatIndex).toEqual(1);
        });
    });
  });
});
