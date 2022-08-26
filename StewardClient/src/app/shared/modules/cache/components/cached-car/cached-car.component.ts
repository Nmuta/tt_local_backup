import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { bigNumbersEqual } from '@helpers/bignumbers';
import { pairwiseSkip } from '@helpers/rxjs';
import { DetailedCar } from '@models/detailed-car';
import { GameTitleAbbreviation } from '@models/enums';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { BigNumber } from 'bignumber.js';
import { EMPTY, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { WoodstockCarsCacheService } from '../../managers/woodstock/cars-cache.service';

/** Displays a chip for a cached car. */
@Component({
  selector: 'cached-car',
  templateUrl: './cached-car.component.html',
  styleUrls: ['./cached-car.component.scss'],
})
export class CachedCarComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() public title: GameTitleAbbreviation = null;
  @Input() public carId: BigNumber;

  public monitor = new ActionMonitor('Get Car Data');
  public carData: DetailedCar = null;

  private carId$ = new Subject<BigNumber>();

  public get copyText(): string {
    const carData = this.carData;
    if (!!carData) {
      return `${carData.make} | ${carData.model} | ${carData.id}`;
    }

    return null;
  }

  constructor(private readonly woodstock: WoodstockCarsCacheService) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.carId$
      .pipe(
        pairwiseSkip((prev, cur) => bigNumbersEqual(prev, cur)),
        this.monitor.monitorStart(),
        tap(() => this.carData = null),
        switchMap(v => this.getCarData$(v).pipe(this.monitor.monitorCatch())),
        this.monitor.monitorEnd(),
        takeUntil(this.onDestroy$),
      )
      .subscribe(carData => (this.carData = carData));
    this.carId$.next(this.carId);
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(_: SimpleChanges): void {
    this.carId$.next(this.carId);
  }

  private getCarData$(carId: BigNumber): Observable<DetailedCar> {
    switch (this.title) {
      case GameTitleAbbreviation.FH5:
        return this.woodstock.getDetails$(carId);
      default:
        return EMPTY;
    }
  }
}
