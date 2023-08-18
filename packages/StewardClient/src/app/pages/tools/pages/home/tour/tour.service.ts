import { Injectable } from '@angular/core';
import { TourService } from 'ngx-ui-tour-md-menu';
import { Select, Store } from '@ngxs/store';
import { Observable, startWith } from 'rxjs';
import { renderGuard } from '@helpers/rxjs';
import { SetHomeTour } from '@shared/state/tours/tours.actions';
import { TourState, TourStateModel } from '@shared/state/tours/tours.state';
import { homeTourSteps } from './config';

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

  /** Checks if the Home tour should run */
  public shouldShowHomeTour(): boolean {
    const showUserTours = this.store.selectSnapshot<boolean>(TourState.enableUserTours);
    let showHomeTour = this.store.selectSnapshot<boolean>(TourState.enableHomeTour);
    
    // If showUserTours is false, the user has disabled User Tours
    // this function will automatically toggle off the individual tours
    if (showUserTours === false) {
      showHomeTour = false;
      this.store.dispatch(new SetHomeTour(false));
    }

    return showHomeTour;
  }


    /** Starts the Home tour */
    public homeTourStart(): void {
      if (this.shouldShowHomeTour()) {
        this.tourService.initialize(homeTourSteps);

        this.tourService
        .end$
        .subscribe(() => {
          this.store.dispatch(new SetHomeTour(false));
        });

        renderGuard(() => {
          this.tourService.start();
        });
      }
    }
}