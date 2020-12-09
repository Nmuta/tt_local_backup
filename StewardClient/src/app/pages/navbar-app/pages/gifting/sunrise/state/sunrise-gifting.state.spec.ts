import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { SunriseGiftingState } from './sunrise-gifting.state';

describe('SunriseGiftingState', () => {
  // let store: Store;
  let service: SunriseGiftingState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([SunriseGiftingState])],
    });
    service = TestBed.inject(SunriseGiftingState);
    // store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
