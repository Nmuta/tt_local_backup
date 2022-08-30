import { Injectable } from '@angular/core';
import { DetailedCar } from '@models/detailed-car';
import { PegasusProjectionSlot } from '@models/enums';
import { WoodstockService } from '@services/woodstock';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import BigNumber from 'bignumber.js';
import { Observable, of, ReplaySubject, switchMap } from 'rxjs';

/** Caches car lookups for quick display. */
@Injectable({ providedIn: 'root' })
export class WoodstockCarsCacheService {
  private lookup = new Map<string, DetailedCar>();
  public monitor = new ActionMonitor('Get Woodstock Cars');
  public lookupHasChanged$ = new ReplaySubject<void>(1); // this has the effect of EMPTY until we have retrieved values at least once

  constructor(private readonly woodstock: WoodstockService) {
    this.updateLookup();
  }

  /** Produces the details of a car, if we have it. */
  public getDetails(carId: string | BigNumber): DetailedCar | null {
    carId = carId.toString();
    if (this.lookup.has(carId)) {
      return this.lookup.get(carId);
    }

    return null;
  }

  /** Produces the details of a car immediately, if we have it. Or when we get it, if we do not. */
  public getDetails$(carId: string | BigNumber): Observable<DetailedCar> {
    const carIdString = carId.toString();
    if (this.lookup.has(carIdString)) {
      return of(this.lookup.get(carIdString));
    }

    return this.lookupHasChanged$.pipe(switchMap(() => of(this.lookup.get(carIdString))));
  }

  /** Updates the lookup, eventually. */
  public updateLookup(): void {
    this.monitor = this.monitor.repeat();
    this.woodstock
      .getDetailedCars$(PegasusProjectionSlot.LiveSteward)
      .pipe(this.monitor.monitorSingleFire())
      .subscribe(r => {
        this.produceLookups(r);
        this.lookupHasChanged$.next();
      });
  }

  private produceLookups(cars: DetailedCar[]): void {
    for (const car of cars) {
      this.lookup.set(car.id.toString(), car);
    }
  }
}
