import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { NgxsModule, Store } from '@ngxs/store';

import { ApolloGiftingState } from '../apollo-gifting.state';
import { SetApolloGiftingSelectedPlayerIdentities } from '../apollo-gifting.state.actions';

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
    const selectedPlayerIdentities: IdentityResultAlpha = { query: { xuid: BigInt(0) }, gamertag: 'test-gamertag',  };
    let action;
    beforeEach(() => {
      action = new SetApolloGiftingSelectedPlayerIdentities([selectedPlayerIdentities]);
      store.reset({
        apolloGifting: {
          selectedPlayerIdentities: [],
        },
      });
    });
    it('should patch access token to undefined', () => {
      // Action
      store.dispatch(action);

      // Assert
      store
        .selectOnce(state => state.apolloGifting.selectedPlayerIdentities)
        .subscribe(selectedPlayerIdentities => {
          expect(selectedPlayerIdentities.length).toEqual(1);
          expect(selectedPlayerIdentities[0]).toEqual(selectedPlayerIdentities);
        });
    });
  });
});
