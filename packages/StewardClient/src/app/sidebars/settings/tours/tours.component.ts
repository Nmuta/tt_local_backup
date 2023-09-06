import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { Select, Store } from '@ngxs/store';
import { SetUserTours, SetHomeTour } from '@shared/state/tours/tours.actions';
import { TourState, TourStateModel } from '@shared/state/tours/tours.state';
import { UserTourService } from '@tools-app/pages/home/tour/tour.service';
import { Observable, takeUntil } from 'rxjs';

/** Configuration page for Tours. */
@Component({
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.scss']
})
export class ToursComponent extends BaseComponent implements OnInit {
  @Select(TourState) public tourState$: Observable<TourStateModel>;

  public enableHomeTour: boolean;
  public enableUserTours: boolean;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly userTourService: UserTourService,
  ) {
    super();
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    this.tourState$.pipe(takeUntil(this.onDestroy$)).subscribe(latest => {
      this.enableHomeTour = latest.enableHomeTour;
      this.enableUserTours = latest.enableUserTours;
    });
  }


  /** Fired when any setting changes. */
  public syncUserTours(): void {
    this.store.dispatch(new SetUserTours(this.enableUserTours));
  }

  /** Fired when any setting changes. */
  public syncHomeTour(): void {
    this.store.dispatch(new SetHomeTour(this.enableHomeTour));
  }

  /** Enables and immediately begins the home tour. */
  public beginHomeTour(): void {
    this.enableHomeTour = true;
    this.syncHomeTour();
    this.router.navigate(['app', 'tools', 'home']);
  }

  /** Sets the home tour boolean in settings. */
  public setHomeTour(): void {
    this.store.dispatch(new SetHomeTour(true));
  }

  /** Sets all tour booleans in settings. */
  public setAllTours(): void {
    this.store.dispatch(new SetUserTours(!this.enableUserTours));
  }
}
