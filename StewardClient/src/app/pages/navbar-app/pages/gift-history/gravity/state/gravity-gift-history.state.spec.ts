import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IdentityResultBeta } from '@models/identity-query.model';
import { NgxsModule, Store } from '@ngxs/store';

import { GravityGiftHistoryState } from './gravity-gift-history.state';
import { SetGravitySelectedPlayerIdentities } from './gravity-gift-history.state.actions';

describe('GravityGiftHistoryState', () => {
  let store: Store;
  let service: GravityGiftHistoryState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([GravityGiftHistoryState])],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(GravityGiftHistoryState);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('[SetGravitySelectedPlayerIdentities] Action', () => {
    const selectedPlayerIdentities: IdentityResultBeta = {
      query: { xuid: BigInt(0) },
      gamertag: 'test-gamertag',
    };

    let action;
    beforeEach(() => {
      action = new SetGravitySelectedPlayerIdentities([selectedPlayerIdentities]);
      store.reset({
        gravityGiftHistory: {
          selectedPlayerIdentities: [],
        },
      });
    });
    
    it('should patch selected player identities', () => {
      store.dispatch(action);

      store
        .selectOnce(state => state.gravityGiftHistory.selectedPlayerIdentities)
        .subscribe(data => {
          expect(data.length).toEqual(1);
          expect(data[0]).toEqual(selectedPlayerIdentities);
        });
    });
  });
});
