import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { AuctionBlocklistEntry } from '@models/auction-blocklist-entry';
import { GameTitle } from '@models/enums';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, delay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { DateValidators } from '@shared/validators/date-validators';
import { DateTime } from 'luxon';
import BigNumber from 'bignumber.js';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { replace } from '@helpers/replace';
import { flatten } from 'lodash';
import { AuctionBlocklistService } from './auction-blocklist.base.service';

/** Interface used to track action monitor, form group, and edit state across rows. */
export interface FormGroupBlocklistEntry {
  formGroup: FormGroup;
  edit?: boolean;
  postMonitor: ActionMonitor;
  deleteMonitor: ActionMonitor;
}

/**
 *  Auction blocklist base component.
 */
@Component({
  selector: 'auction-blocklist-base',
  templateUrl: './auction-blocklist.base.component.html',
  styleUrls: ['./auction-blocklist.base.component.scss'],
})
export class AuctionBlocklistBaseComponent extends BaseComponent implements OnInit {
  @Input() service: AuctionBlocklistService;
  @Input() newEntries$: Observable<AuctionBlocklistEntry[]>;

  private readonly getBlocklist$ = new Subject<AuctionBlocklistEntry[]>();
  private readonly noExpireDefaultTime = DateTime.local(9999, 12, 31);

  public rawBlocklist: AuctionBlocklistEntry[];
  public blocklist = new MatTableDataSource<FormGroupBlocklistEntry>();
  public columnsToDisplay = ['carId', 'description', 'expireDate', 'actions'];

  public formArray: FormArray = new FormArray([]);
  public formGroup = new FormGroup({ expireDate: this.formArray });

  public inputPostMonitor: ActionMonitor = new ActionMonitor('INPUT POST');
  public getMonitor: ActionMonitor = new ActionMonitor('GET');
  public allMonitors = [this.getMonitor, this.inputPostMonitor];

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

    this.newEntries$.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.getBlocklist$.next();
    });

    this.getBlocklist$
      .pipe(
        tap(() => (this.getMonitor = this.updateMonitors(this.getMonitor))),
        switchMap(() => {
          this.blocklist.data = undefined;
          return this.service.getAuctionBlocklist$().pipe(
            this.getMonitor.monitorSingleFire(),
            catchError(() => {
              this.blocklist.data = undefined;
              return EMPTY;
            }),
          );
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(returnList => {
        const controls: FormGroupBlocklistEntry[] = returnList.map(entry => {
          const newControls = <FormGroupBlocklistEntry>{
            formGroup: new FormGroup({
              carId: new FormControl(entry.carId, [Validators.required]),
              description: new FormControl(entry.description),
              doesExpire: new FormControl(entry.doesExpire, [Validators.required]),
              expireDateUtc: new FormControl(
                { value: entry.expireDateUtc.toISO(), disabled: !entry.doesExpire },
                [Validators.required, DateValidators.isAfter(DateTime.local().startOf('day'))],
              ),
            }),
            postMonitor: new ActionMonitor('POST'),
            deleteMonitor: new ActionMonitor('DELETE'),
          };

          newControls.formGroup.controls.doesExpire.valueChanges.subscribe((value: boolean) => {
            if (value) {
              newControls.formGroup.controls.expireDateUtc.enable();
            } else {
              newControls.formGroup.controls.expireDateUtc.disable();
            }
          });

          return newControls;
        });

        this.rawBlocklist = returnList;
        this.allMonitors = flatten(controls.map(v => [v.postMonitor, v.deleteMonitor])).concat(
          this.getMonitor,
          this.inputPostMonitor,
        );
        this.formArray = new FormArray(controls.map(v => v.formGroup));
        this.blocklist.data = controls;
      });

    this.getBlocklist$.next();
  }

  /** Update blocklist selected */
  public updateBlocklistEntry(entry: FormGroupBlocklistEntry): void {
    const entryArray: AuctionBlocklistEntry[] = [
      {
        carId: entry.formGroup.controls.carId.value as BigNumber,
        description: entry.formGroup.controls.description.value as string,
        doesExpire: entry.formGroup.controls.doesExpire.value as boolean,
        expireDateUtc:
          (entry.formGroup.controls.expireDateUtc.value as DateTime) ?? this.noExpireDefaultTime,
      },
    ];

    entry.postMonitor = this.updateMonitors(entry.postMonitor);
    this.service
      .postAuctionBlocklistEntries$(entryArray)
      .pipe(
        entry.postMonitor.monitorSingleFire(),
        delay(0), // 1 frame delay to allow action monitors to update.
        catchError(() => {
          return EMPTY;
        }),
      )
      .subscribe(() => this.replaceEntry(entry));
  }

  /** Remove blocklist selected */
  public removeBlocklistEntry(entry: FormGroupBlocklistEntry): void {
    const carId = entry.formGroup.controls.carId.value as BigNumber;
    entry.deleteMonitor = this.updateMonitors(entry.deleteMonitor);
    this.service
      .deleteAuctionBlocklistEntry$(carId)
      .pipe(
        entry.deleteMonitor.monitorSingleFire(),
        delay(0), // 1 frame delay to allow action monitors to update.
        catchError(() => {
          return EMPTY;
        }),
      )
      .subscribe(() => this.deleteEntry(entry));
  }

  /** Reverts an entry from edit state. */
  public revertEntryEdit(entry: FormGroupBlocklistEntry): void {
    entry.edit = false;
    const rawEntry = this.rawBlocklist.find(v => v.carId == entry.formGroup.controls.carId.value);
    entry.formGroup.controls.expireDateUtc.setValue(rawEntry.expireDateUtc.toISO());
    entry.formGroup.controls.doesExpire.setValue(rawEntry.doesExpire);
  }

  /** Test */
  public asFormGroupBlocklistEntry(entry: FormGroupBlocklistEntry): FormGroupBlocklistEntry {
    return entry;
  }

  /** Recreates the given action monitor, replacing it in the allMonitors list. */
  private updateMonitors(oldMonitor: ActionMonitor): ActionMonitor {
    oldMonitor.dispose();
    const newMonitor = new ActionMonitor(oldMonitor.label);
    this.allMonitors = replace(this.allMonitors, oldMonitor, newMonitor);
    return newMonitor;
  }

  private deleteEntry(entry: FormGroupBlocklistEntry): void {
    const index = this.blocklist.data.indexOf(entry);
    this.formArray.removeAt(index);
    this.blocklist.data.splice(index, 1);
    this.rawBlocklist.splice(index, 1);
    entry.deleteMonitor.dispose();
    entry.postMonitor.dispose();
    this.blocklist._updateChangeSubscription();
  }

  private replaceEntry(entry: FormGroupBlocklistEntry): void {
    const newEntry: AuctionBlocklistEntry = {
      carId: entry.formGroup.controls.carId.value as BigNumber,
      description: entry.formGroup.controls.description.value as string,
      doesExpire: entry.formGroup.controls.doesExpire.value as boolean,
      expireDateUtc:
        (entry.formGroup.controls.expireDateUtc.value as DateTime) ?? this.noExpireDefaultTime,
    };

    entry.edit = false;
    const index = this.blocklist.data.indexOf(entry);
    this.rawBlocklist.splice(index, 0, newEntry);
    this.blocklist._updateChangeSubscription();
  }
}
