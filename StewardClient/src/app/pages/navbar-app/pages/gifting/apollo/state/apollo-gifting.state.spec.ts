import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { ApolloGiftingState } from './apollo-gifting.state';

describe('ApolloGiftingState', () => {
  // let store: Store;
  let service: ApolloGiftingState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([ApolloGiftingState])],
    });
    service = TestBed.inject(ApolloGiftingState);
    // store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
