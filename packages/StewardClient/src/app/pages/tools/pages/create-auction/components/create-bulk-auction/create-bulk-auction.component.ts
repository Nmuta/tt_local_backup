import { Component, Input, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDatepicker } from '@angular/material/datepicker';
import { BaseComponent } from '@components/base-component/base.component';
import { tryParseBigNumber } from '@helpers/bignumbers';
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

export interface CreateBulkAuctionContract {
  gameTitle: GameTitle;
  createBulkAuction$(
    sellerId: BigNumber,
    oneOfEveryCar: boolean,
    numberOfRandomCars: number,
    durationInMinutes: number,
  ): Observable<string[]>;
}

/** The Create Bulk Auction page. */
@Component({
  selector: 'create-bulk-auction',
  templateUrl: './create-bulk-auction.component.html',
  styleUrls: ['./create-bulk-auction.component.scss'],
})
export class CreateBulkAuctionComponent extends BaseComponent {
  @ViewChild(MatCheckbox) verifyCheckbox: MatCheckbox;
  @ViewChild('datePicker') public datePicker: MatDatepicker<Date>;

  /** Create bulk auction service contract. */
  @Input() service: CreateBulkAuctionContract;

  public options: DurationOption[] = [
    { duration: Duration.fromObject({ minutes: 10 }), humanized: '10 minutes' },
    { duration: Duration.fromObject({ hours: 1 }), humanized: '1 hour' },
    { duration: Duration.fromObject({ hours: 3 }), humanized: '3 hours' },
    { duration: Duration.fromObject({ hours: 6 }), humanized: '6 hours' },
    { duration: Duration.fromObject({ hours: 12 }), humanized: '12 hours' },
  ];

  public submitCreateAuctionMonitor = new ActionMonitor('POST Create Bulk Auction');
  public auctionsIdList: string;
  public readonly permAttribute = PermAttributeName.CreateAuctions;

  public formControls = {
    sellerId: new UntypedFormControl(null, [Validators.required]),
    oneOfEveryCar: new UntypedFormControl(null),
    numberOfRandomCars: new UntypedFormControl(0, [Validators.required]),
    durationInMinutes: new UntypedFormControl(null, [Validators.required]),
    durationOptions: new UntypedFormControl(null),
    isOneOfEveryCars: new UntypedFormControl(true, [Validators.required]),
  };

  public formGroup: UntypedFormGroup = new UntypedFormGroup(this.formControls);

  constructor() {
    super();

    this.formControls.durationOptions.valueChanges.subscribe(value => this.updateDuration(value));
  }

  /** Updates the end date. */
  public updateDuration(newDuration: Duration): void {
    this.formControls.durationInMinutes.setValue(newDuration.as('minutes'));
  }

  /** Submit auction creation. */
  public submitCreateAuction(): void {
    this.submitCreateAuctionMonitor = this.submitCreateAuctionMonitor.repeat();
    this.verifyCheckbox.checked = false;

    this.service
      .createBulkAuction$(
        tryParseBigNumber(this.formControls.sellerId.value),
        this.formControls.isOneOfEveryCars.value,
        this.formControls.numberOfRandomCars.value,
        this.formControls.durationInMinutes.value,
      )
      .pipe(this.submitCreateAuctionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(auctionIds => {
        this.auctionsIdList = auctionIds.join(', ');
      });
  }
}
