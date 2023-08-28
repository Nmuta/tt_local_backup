import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { AppState } from '../app-state';
import { SetHomeTour, SetUserTours } from './tours.actions';

import { TourState } from './tours.state';
//import { createStandardTestModuleMetadata } from '@mocks/standard-test-module-metadata';
import { TourMatMenuModule } from 'ngx-ui-tour-md-menu';
import { createMockUserTourService } from '@tools-app/pages/home/tour/tour.service.mock';

describe('UserTourService', () => {
  let store: Store;
  let service: TourState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([TourState]), TourMatMenuModule],
      providers: [createMockUserTourService()],
    });
    service = TestBed.inject(TourState);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Action: SetHomeTour', () => {
    it('should sync setting: SetHomeTour(true)', () => {
      store.dispatch(new SetHomeTour(true));
      store
        .selectOnce((state: AppState) => state.tour.enableHomeTour)
        .subscribe(enableHomeTour => {
          expect(enableHomeTour).toBe(true);
        });
    });

    it('should sync setting: SetHomeTour(false)', () => {
      store.dispatch(new SetHomeTour(false));
      store
        .selectOnce((state: AppState) => state.tour.enableHomeTour)
        .subscribe(enableHomeTour => {
          expect(enableHomeTour).toBe(false);
        });
    });
  });

  describe('Action: SetUserTours', () => {
    it('should sync setting: SetUserTours(true)', () => {
      store.dispatch(new SetUserTours(true));
      store
        .selectOnce((state: AppState) => state.tour.enableUserTours)
        .subscribe(enableUserTours => {
          expect(enableUserTours).toBe(true);
        });
    });

    it('should sync setting: SetUserTours(false)', () => {
      store.dispatch(new SetUserTours(false));
      store
        .selectOnce((state: AppState) => state.tour.enableUserTours)
        .subscribe(enableUserTours => {
          expect(enableUserTours).toBe(false);
        });
    });
  });
});
