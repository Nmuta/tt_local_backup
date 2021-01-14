import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { NgxsModule, Store } from '@ngxs/store';
import { OpusGiftingState } from '../opus-gifting.state';
import { SetOpusSelectedPlayerIdentities } from '../opus-gifting.state.actions';

describe('OpusGiftingState', () => {
  let service: OpusGiftingState;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([OpusGiftingState])],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(OpusGiftingState);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('[SetOpusSelectedPlayerIdentities] Action', () => {
    const selectedPlayerIdentities: IdentityResultAlpha = { query: { xuid: BigInt(0) }, gamertag: 'test-gamertag',  };
    let action;
    beforeEach(() => {
      action = new SetOpusSelectedPlayerIdentities([selectedPlayerIdentities]);
      store.reset({
        opusGifting: {
          selectedPlayerIdentities: [],
        },
      });
    });
    it('should patch selected player identities', () => {
      // Action
      store.dispatch(action);

      // Assert
      store
        .selectOnce(state => state.opusGifting.selectedPlayerIdentities)
        .subscribe(data => {
          expect(data.length).toEqual(1);
          expect(data[0]).toEqual(selectedPlayerIdentities);
        });
    });
  });
});
