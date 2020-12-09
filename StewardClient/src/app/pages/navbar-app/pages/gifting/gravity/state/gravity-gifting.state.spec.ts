import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { GravityGiftingState } from './gravity-gifting.state';

describe('GravityGiftingState', () => {
  // let store: Store;
  let service: GravityGiftingState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([GravityGiftingState])],
    });
    service = TestBed.inject(GravityGiftingState);
    // store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
