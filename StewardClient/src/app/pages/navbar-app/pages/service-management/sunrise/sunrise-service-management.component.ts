import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { AuctionBlocklistEntry } from '@models/auction-blocklist-entry';
import { GameTitleCodeName } from '@models/enums';
import { SunriseService } from '@services/sunrise';
import { EMPTY, Subject } from 'rxjs';
import { catchError, delay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { DateValidators } from '@shared/validators/date-validators';
import { DateTime } from 'luxon';
import BigNumber from 'bignumber.js';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { replace } from '@helpers/replace';
import { flatten } from 'lodash';

/** Interface used to track action monitor, form group, and edit state across rows. */
export interface FormGroupBlocklistEntry {
  formGroup: FormGroup;
  edit?: boolean;
  postMonitor: ActionMonitor;
  deleteMonitor: ActionMonitor;
}

/**
 *  Sunrise service management component.
 */
@Component({
  templateUrl: './sunrise-service-management.component.html',
  styleUrls: ['./sunrise-service-management.component.scss'],
})
export class SunriseServiceManagementComponent extends BaseComponent implements OnInit {
  public gameTitle: GameTitleCodeName = GameTitleCodeName.FH4;
  private readonly getBlocklist$ = new Subject<AuctionBlocklistEntry[]>();
  private readonly noExpireDefaultTime = DateTime.local(9999, 12, 31);

  public rawBlocklist: AuctionBlocklistEntry[];
  public blocklist = new MatTableDataSource<FormGroupBlocklistEntry>();
  public columnsToDisplay = ['carId', 'description', 'expireDate', 'actions'];

  public formArray: FormArray = new FormArray([]);
  public formGroup = new FormGroup({ expireDate: this.formArray });

  public inputFormControl = {
    carId: new FormControl(null, [Validators.required]),
    description: new FormControl(null),
    doesExpire: new FormControl(true, [Validators.required]),
    expireDateUtc: new FormControl(null, [
      Validators.required,
      DateValidators.isAfter(DateTime.local().startOf('day')),
    ]),
  };

  public inputFormGroup = new FormGroup({ ...this.inputFormControl });

  public inputPostMonitor: ActionMonitor = new ActionMonitor('INPUT POST');
  public getMonitor: ActionMonitor = new ActionMonitor('GET');
  public allMonitors = [this.getMonitor, this.inputPostMonitor];

  constructor(private readonly sunriseService: SunriseService) {
    super();
  }

  public dateTimeFutureFilter = (input: DateTime | null): boolean => {
    const day = input || DateTime.local().startOf('day');
    return day > DateTime.local().startOf('day');
  };

  /** OnInit */
  public ngOnInit(): void {
    this.inputFormGroup.controls.doesExpire.valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.inputFormGroup.controls.expireDateUtc.enable();
      } else {
        this.inputFormGroup.controls.expireDateUtc.disable();
      }
    });

    this.getBlocklist$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(() => (this.getMonitor = this.updateMonitors(this.getMonitor))),
        switchMap(() => {
          this.blocklist.data = undefined;
          return this.sunriseService.getAuctionBlocklist$().pipe(
            this.getMonitor.monitorSingleFire(),
            catchError(() => {
              this.blocklist.data = undefined;
              return EMPTY;
            }),
          );
        }),
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

  /** Input blocklist entry. */
  public inputBlocklistEntry(): void {
    const carFilter = this.inputFormGroup.controls.carId.value;
    const carId = carFilter?.id ?? undefined;
    const entryArray: AuctionBlocklistEntry[] = [
      {
        carId: carId as BigNumber,
        description: this.inputFormGroup.controls.description.value as string,
        doesExpire: this.inputFormGroup.controls.doesExpire.value as boolean,
        expireDateUtc:
          (this.inputFormGroup.controls.expireDateUtc.value as DateTime) ??
          this.noExpireDefaultTime,
      },
    ];

    this.inputPostMonitor = this.updateMonitors(this.inputPostMonitor);
    this.sunriseService
      .postAuctionBlocklistEntries$(entryArray)
      .pipe(
        this.inputPostMonitor.monitorSingleFire(),
        delay(0), // 1 frame delay to allow action monitors to update.
        catchError(() => {
          return EMPTY;
        }),
      )
      .subscribe(() => this.getBlocklist$.next());
  }

  /** Update blocklist selected */
  public updateBlocklistEntry(entry: FormGroupBlocklistEntry): void {
    const entryArray: AuctionBlocklistEntry[] = [
      {
        carId: entry.formGroup.controls.carId.value as BigNumber,
        description: this.inputFormGroup.controls.description.value as string,
        doesExpire: entry.formGroup.controls.doesExpire.value as boolean,
        expireDateUtc:
          (entry.formGroup.controls.expireDateUtc.value as DateTime) ?? this.noExpireDefaultTime,
      },
    ];

    entry.postMonitor = this.updateMonitors(entry.postMonitor);
    this.sunriseService
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
    this.sunriseService
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
      description: this.inputFormGroup.controls.description.value as string,
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
