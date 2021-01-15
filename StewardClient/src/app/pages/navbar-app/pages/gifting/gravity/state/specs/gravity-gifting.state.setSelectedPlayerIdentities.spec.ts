import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IdentityResultBeta } from '@models/identity-query.model';
import { NgxsModule, Store } from '@ngxs/store';
import { GravityGiftingState } from '../gravity-gifting.state';
import { SetGravitySelectedPlayerIdentities } from '../gravity-gifting.state.actions';

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
      query: { xuid: BigInt(0) },
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
});
