import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { SunriseGiftingState } from '../sunrise-gifting.state';
import { SetSunriseGiftingMatTabIndex } from '../sunrise-gifting.state.actions';

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
      // Action
      store.dispatch(action);

      // Assert
      store
        .selectOnce(state => state.sunriseGifting.selectedMatIndex)
        .subscribe(selectedMatIndex => {
          expect(selectedMatIndex).toEqual(1);
        });
    });
  });
});
