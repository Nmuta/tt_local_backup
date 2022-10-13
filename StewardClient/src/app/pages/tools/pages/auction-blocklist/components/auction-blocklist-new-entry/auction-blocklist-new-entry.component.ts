import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { AuctionBlocklistEntry } from '@models/auction-blocklist-entry';
import { GameTitle } from '@models/enums';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DateValidators } from '@shared/validators/date-validators';
import { DateTime } from 'luxon';
import BigNumber from 'bignumber.js';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { AuctionBlocklistNewEntryService } from './auction-blocklist-new-entry.service';
import { renderDelay } from '@helpers/rxjs';

/**
 *  Auction blocklist new entry component.
 */
@Component({
  selector: 'auction-blocklist-new-entry',
  templateUrl: './auction-blocklist-new-entry.component.html',
  styleUrls: ['./auction-blocklist-new-entry.component.scss'],
})
export class AuctionBlocklistNewEntryComponent extends BaseComponent implements OnInit {
  /** REVIEW-COMMENT: The auction blocklist new entry service. */
  @Input() service: AuctionBlocklistNewEntryService;
  /** REVIEW-COMMENT: Output when a new list of auction blocklist entry is created. */
  @Output() newEntries = new EventEmitter<AuctionBlocklistEntry[]>();

  private readonly noExpireDefaultTime = DateTime.local(9999, 12, 31);

  public formControls = {
    carId: new FormControl(null, [Validators.required]),
    description: new FormControl(null),
    doesExpire: new FormControl(true, [Validators.required]),
    expireDateUtc: new FormControl(null, [
      Validators.required,
      DateValidators.isAfter(DateTime.local().startOf('day')),
    ]),
  };

  public formGroup = new FormGroup(this.formControls);

  public postMonitor: ActionMonitor = new ActionMonitor('INPUT POST');

  /** Gets the game title. */
  public get gameTitle(): GameTitle {
    return this.service.getGameTitle();
  }

  public dateTimeFutureFilter = (input: DateTime | null): boolean => {
    const day = input || DateTime.local().startOf('day');
    return day > DateTime.local().startOf('day');
  };

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (!this.service) {
      throw new Error('No service provided for AuctionBlocklistBaseComponent');
    }

    this.formControls.doesExpire.valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.formControls.expireDateUtc.enable();
      } else {
        this.formControls.expireDateUtc.disable();
      }
    });
  }

  /** Submits a new blocklist entry. */
  public submitNewBlocklistEntry(): void {
    const carFilter = this.formControls.carId.value;
    const carId = carFilter?.id ?? undefined;
    const entryArray: AuctionBlocklistEntry[] = [
      {
        carId: carId as BigNumber,
        description: this.formControls.description.value as string,
        doesExpire: this.formControls.doesExpire.value as boolean,
        expireDateUtc:
          (this.formControls.expireDateUtc.value as DateTime) ?? this.noExpireDefaultTime,
      },
    ];

    this.postMonitor = this.updateMonitors(this.postMonitor);
    this.service
      .postAuctionBlocklistEntries$(entryArray)
      .pipe(
        this.postMonitor.monitorSingleFire(),
        renderDelay(),
        catchError(() => {
          return EMPTY;
        }),
      )
      .subscribe(data => {
        this.newEntries.emit(data);
        this.resetForm();
      });
  }

  /** Recreates the given action monitor, replacing it in the allMonitors list. */
  private updateMonitors(oldMonitor: ActionMonitor): ActionMonitor {
    oldMonitor.dispose();
    const newMonitor = new ActionMonitor(oldMonitor.label);
    return newMonitor;
  }

  /** Resets the new entry form. */
  private resetForm(): void {
    this.formGroup.reset();
    this.formControls.carId.setValue(null);
    this.formControls.description.setValue(null);
    this.formControls.doesExpire.setValue(true);
    this.formControls.expireDateUtc.setValue(null);
  }
}
