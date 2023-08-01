import { Injectable } from '@angular/core';
import { TourService } from 'ngx-ui-tour-md-menu';
import { Select, Store } from '@ngxs/store';
import { Observable, startWith } from 'rxjs';
import { SetHomeTour } from '@shared/state/tours/tours.actions';
import { TourState, TourStateModel } from '@shared/state/tours/tours.state';
import { tourSteps } from './config';
//import { homeTourText, tourClasses } from './config';

/** will run ngx */
@Injectable({
  providedIn: 'root',
})
export class UserTourService {
  @Select(TourState)
  private readonly tourState$: Observable<TourStateModel>;
  private state: TourStateModel;

  constructor(
    private readonly store: Store,
    private tourService: TourService,
  ) {
    
   const snapshot = this.store.selectSnapshot<TourStateModel>(TourState);
   this.tourState$.pipe(startWith(snapshot)).subscribe(state => (this.state = state));
  }

  /** Checks if the tour should run */
  public shouldShowTour() {
    const showAnyTour = this.store.selectSnapshot<boolean>(TourState.enableUserTours);
    let showHomeTour = this.store.selectSnapshot<boolean>(TourState.enableHomeTour);
    
    if (showAnyTour === false) {
      showHomeTour = false;
      this.store.dispatch(new SetHomeTour(false));
    }

    return showHomeTour;
  }


    /** Starts the tour */
    start() {
      if (this.shouldShowTour()) {
        this.tourService.initialize(tourSteps);

        this.tourService
        .end$
        .subscribe(x => {
          this.store.dispatch(new SetHomeTour(false));
          return x;
        });

        setTimeout(() => {
          this.tourService.start();
        }, 5000);
      }
    }
}