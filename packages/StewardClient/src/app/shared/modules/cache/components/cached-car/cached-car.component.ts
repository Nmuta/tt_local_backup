import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { pairwiseSkip, PairwiseSkipPredicates } from '@helpers/rxjs';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { SimpleCar } from '@models/cars';
import { GameTitle } from '@models/enums';
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
  /** REVIEW-COMMENT: Game title. */
  @Input() public title: GameTitle = null;
  /** REVIEW-COMMENT: Car id. */
  @Input() public carId: BigNumber;
  /** REVIEW-COMMENT: Hide if unavailable. Default to false. */
  @Input() public hideIfUnavailable = false;

  public shouldHide = false;
  public monitor = new ActionMonitor('Get Car Data');
  public carData: SimpleCar = null;

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
    this.shouldHide = this.hideIfUnavailable && !this.isAvailable();
    this.carId$
      .pipe(
        tap(_ => {
          this.shouldHide = this.hideIfUnavailable && !this.isAvailable();
        }),
        pairwiseSkip(PairwiseSkipPredicates.bigNumber),
        this.monitor.monitorStart(),
        tap(() => (this.carData = null)),
        switchMap(v => this.getCarData$(v).pipe(this.monitor.monitorCatch())),
        this.monitor.monitorEnd(),
        takeUntil(this.onDestroy$),
      )
      .subscribe(carData => (this.carData = carData));
    this.carId$.next(this.carId);
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(_: BetterSimpleChanges<CachedCarComponent>): void {
    this.carId$.next(this.carId);
  }

  private isAvailable(): boolean {
    return this.getCarData$(new BigNumber(NaN)) !== EMPTY;
  }

  private getCarData$(carId: BigNumber): Observable<SimpleCar> {
    switch (this.title) {
      case GameTitle.FH5:
        return this.woodstock.getDetails$(carId);
      default:
        return EMPTY;
    }
  }
}
