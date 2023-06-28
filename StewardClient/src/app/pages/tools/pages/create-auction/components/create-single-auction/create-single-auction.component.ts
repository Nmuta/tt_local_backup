import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { BaseComponent } from '@components/base-component/base.component';
import { tryParseBigNumber } from '@helpers/bignumbers';
import { getAuctionDetailsRoute } from '@helpers/route-links';
import { GameTitle } from '@models/enums';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import BigNumber from 'bignumber.js';
import { Duration } from 'luxon';
import { Observable, takeUntil } from 'rxjs';

interface DurationOption {
  duration: Duration;
  humanized: string;
}

export interface CreateSingleAuctionContract {
  gameTitle: GameTitle;
  createSingleAuction$(
    carId: BigNumber,
    openingPrice: number,
    buyoutPrice: number,
    durationInMS: number,
    sellerId: BigNumber,
  ): Observable<string>;
}

/** The Create Single Auction page. */
@Component({
  selector: 'create-single-auction',
  templateUrl: './create-single-auction.component.html',
  styleUrls: ['./create-single-auction.component.scss'],
})
export class CreateSingleAuctionComponent extends BaseComponent {
  @ViewChild('datePicker') public datePicker: MatDatepicker<Date>;

  /** Create single auction service contract. */
  @Input() service: CreateSingleAuctionContract;

  public options: DurationOption[] = [
    { duration: Duration.fromObject({ hours: 1 }), humanized: '1 hour' },
    { duration: Duration.fromObject({ hours: 3 }), humanized: '3 hours' },
    { duration: Duration.fromObject({ hours: 6 }), humanized: '6 hours' },
    { duration: Duration.fromObject({ hours: 12 }), humanized: '12 hours' },
    { duration: Duration.fromObject({ hours: 24 }), humanized: '24 hours' },
  ];

  public submitCreateAuctionMonitor = new ActionMonitor('POST Create Single Auction');
  public auctionUrl: string[];
  public readonly permAttribute = PermAttributeName.CreateAuctions;

  public formControls = {
    carId: new FormControl(null, [Validators.required]),
    openingPrice: new FormControl(null, [Validators.required]),
    buyoutPrice: new FormControl(null, [Validators.required]),
    durationInMS: new FormControl(null, [Validators.required]),
    durationOptions: new FormControl(null),
    sellerId: new FormControl(null, [Validators.required]),
  };

  public formGroup: FormGroup = new FormGroup(this.formControls);

  constructor() {
    super();

    this.formControls.durationOptions.valueChanges.subscribe(value => this.updateDuration(value));
  }

  /** Updates the duration in ms. */
  public updateDuration(newDuration: Duration): void {
    this.formControls.durationInMS.setValue(newDuration.as('milliseconds'));
  }

  /** Submit auction creation. */
  public submitCreateAuction(): void {
    this.submitCreateAuctionMonitor = this.submitCreateAuctionMonitor.repeat();

    this.service
      .createSingleAuction$(
        this.formControls.carId.value.id,
        this.formControls.openingPrice.value,
        this.formControls.buyoutPrice.value,
        this.formControls.durationInMS.value,
        tryParseBigNumber(this.formControls.sellerId.value),
      )
      .pipe(this.submitCreateAuctionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(auctionId => {
        this.auctionUrl = getAuctionDetailsRoute(this.service.gameTitle, auctionId);
      });
  }
}
