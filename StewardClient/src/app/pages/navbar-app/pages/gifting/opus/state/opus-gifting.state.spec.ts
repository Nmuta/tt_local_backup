import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { OpusGiftingState } from './opus-gifting.state';

describe('OpusGiftingState', () => {
  // let store: Store;
  let service: OpusGiftingState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([OpusGiftingState])],
    });
    service = TestBed.inject(OpusGiftingState);
    // store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
