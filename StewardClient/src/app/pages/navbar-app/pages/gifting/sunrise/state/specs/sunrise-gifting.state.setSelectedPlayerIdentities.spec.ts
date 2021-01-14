import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { NgxsModule, Store } from '@ngxs/store';
import { SunriseGiftingState } from '../sunrise-gifting.state';
import { SetSunriseGiftingSelectedPlayerIdentities } from '../sunrise-gifting.state.actions';

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
      // Action
      store.dispatch(action);

      // Assert
      store
        .selectOnce(state => state.sunriseGifting.selectedPlayerIdentities)
        .subscribe(data => {
          expect(data.length).toEqual(1);
          expect(data[0]).toEqual(selectedPlayerIdentities);
        });
    });
  });
});
