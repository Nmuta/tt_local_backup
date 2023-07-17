import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { NgxsModule, Store } from '@ngxs/store';
import { WoodstockGiftHistoryState } from './woodstock-gift-history.state';
import {
  SetWoodstockGiftHistoryMatTabIndex,
  SetWoodstockGiftHistorySelectedPlayerIdentities,
} from './woodstock-gift-history.state.actions';

describe('WoodstockGiftHistoryState', () => {
  let store: Store;
  let service: WoodstockGiftHistoryState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([WoodstockGiftHistoryState])],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(WoodstockGiftHistoryState);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('[SetWoodstockGiftHistorySelectedPlayerIdentities] Action', () => {
    const selectedPlayerIdentities: IdentityResultAlpha = {
      query: { xuid: new BigNumber(0) },
      gamertag: 'test-gamertag',
    };

    let action;
    beforeEach(() => {
      action = new SetWoodstockGiftHistorySelectedPlayerIdentities([selectedPlayerIdentities]);
      store.reset({
        woodstockGiftHistory: {
          selectedPlayerIdentities: [],
        },
      });
    });

    it('should patch selected player identities', () => {
      store.dispatch(action);

      store
        .selectOnce(state => state.woodstockGiftHistory.selectedPlayerIdentities)
        .subscribe(data => {
          expect(data.length).toEqual(1);
          expect(data[0]).toEqual(selectedPlayerIdentities);
        });
    });
  });

  describe('[SetWoodstockGiftHistoryMatTabIndex] Action', () => {
    const selectedMatIndex: number = 1;
    let action;
    beforeEach(() => {
      action = new SetWoodstockGiftHistoryMatTabIndex(selectedMatIndex);
      store.reset({
        woodstockGiftHistory: {
          selectedMatIndex: 0,
        },
      });
    });

    it('should patch selected mat index', () => {
      store.dispatch(action);

      store
        .selectOnce(state => state.woodstockGiftHistory.selectedMatIndex)
        .subscribe(selectedMatIndex => {
          expect(selectedMatIndex).toEqual(1);
        });
    });
  });
});
