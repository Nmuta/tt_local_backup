import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { DetailedCar } from '@models/cars';
import { ParsePathParamFunctions, PathParams } from '@models/path-params';
import { WoodstockCarsService } from '@services/api-v2/woodstock/cars/woodstock-cars.service';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import BigNumber from 'bignumber.js';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs';

/** The Woodstock car details page. */
@Component({
  templateUrl: './woodstock-car-details.component.html',
  styleUrls: ['./woodstock-car-details.component.scss'],
})
export class WoodstockCarDetailsComponent extends BaseComponent implements OnInit {
  public getActionMonitor = new ActionMonitor('GET car details');
  public carIdLookup: BigNumber;
  public carDetails: DetailedCar;

  /** Gets the car subtitle. */
  public get carSubtitle(): string {
    return !!this.carIdLookup ? this.carIdLookup.toString() : 'No car selected';
  }

  constructor(
    private readonly woodstockCarsService: WoodstockCarsService,
    private readonly route: ActivatedRoute,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.route.params
      .pipe(
        tap(() => {
          this.carIdLookup = null;
          this.carDetails = null;
        }),
        map(() => ParsePathParamFunctions[PathParams.CarId](this.route)),
        filter(carId => !!carId && !carId.isNaN()),
        switchMap(carId => {
          this.carIdLookup = carId;
          this.getActionMonitor = this.getActionMonitor.repeat();
          return this.woodstockCarsService
            .getCar$(carId)
            .pipe(this.getActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$));
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(carDetails => {
        this.carDetails = carDetails;
      });
  }
}
