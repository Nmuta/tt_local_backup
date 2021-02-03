import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { NgxsModule, Store } from '@ngxs/store';
import { SunriseGiftHistoryState } from './sunrise-gift-history.state';
import {
  SetSunriseGiftHistoryMatTabIndex,
  SetSunriseGiftHistorySelectedPlayerIdentities,
} from './sunrise-gift-history.state.actions';

describe('SunriseGiftHistoryState', () => {
  let store: Store;
  let service: SunriseGiftHistoryState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([SunriseGiftHistoryState])],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(SunriseGiftHistoryState);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('[SetSunriseGiftHistorySelectedPlayerIdentities] Action', () => {
    const selectedPlayerIdentities: IdentityResultAlpha = {
      query: { xuid: BigInt(0) },
      gamertag: 'test-gamertag',
    };

    let action;
    beforeEach(() => {
      action = new SetSunriseGiftHistorySelectedPlayerIdentities([selectedPlayerIdentities]);
      store.reset({
        sunriseGiftHistory: {
          selectedPlayerIdentities: [],
        },
      });
    });

    it('should patch selected player identities', () => {
      store.dispatch(action);

      store
        .selectOnce(state => state.sunriseGiftHistory.selectedPlayerIdentities)
        .subscribe(data => {
          expect(data.length).toEqual(1);
          expect(data[0]).toEqual(selectedPlayerIdentities);
        });
    });
  });

  describe('[SetSunriseGiftHistoryMatTabIndex] Action', () => {
    const selectedMatIndex: number = 1;
    let action;
    beforeEach(() => {
      action = new SetSunriseGiftHistoryMatTabIndex(selectedMatIndex);
      store.reset({
        sunriseGiftHistory: {
          selectedMatIndex: 0,
        },
      });
    });

    it('should patch selected mat index', () => {
      store.dispatch(action);

      store
        .selectOnce(state => state.sunriseGiftHistory.selectedMatIndex)
        .subscribe(selectedMatIndex => {
          expect(selectedMatIndex).toEqual(1);
        });
    });
  });
});
