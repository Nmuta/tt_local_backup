import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { tryParseBigNumbers } from '@helpers/bignumbers';
import { Select } from '@ngxs/store';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import {
  EndpointKeyMemoryModel,
  EndpointKeyMemoryState,
} from '@shared/state/endpoint-key-memory/endpoint-key-memory.state';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

export type BulkBanReviewInput = {
  xuids: BigNumber[];
  woodstockEnvironments: string[];
  sunriseEnvironments: string[];
  apolloEnvironments: string[];
};

/** The bulk ban history input component. */
@Component({
  selector: 'bulk-ban-review-input',
  templateUrl: './bulk-ban-review-input.component.html',
  styleUrls: ['./bulk-ban-review-input.component.scss'],
})
export class BulkBanReviewInputComponent extends BaseComponent implements OnInit {
  @Select(EndpointKeyMemoryState) public endpointKeys$: Observable<EndpointKeyMemoryModel>;
  @Output() selection = new EventEmitter<BulkBanReviewInput>();

  public woodstockEnvs: string[];
  public sunriseEnvs: string[];
  public apolloEnvs: string[];
  public getEndpoints = new ActionMonitor('Retrieve Endpoint Keys');

  public formControls = {
    woodstockEnvs: new FormControl([]),
    sunriseEnvs: new FormControl([]),
    apolloEnvs: new FormControl([]),
    xuids: new FormControl('', Validators.required),
  };

  public formGroup = new FormGroup(this.formControls);

  /** Initialization hook. */
  public ngOnInit(): void {
    this.getEndpoints = this.getEndpoints.repeat();

    this.endpointKeys$
      .pipe(
        first(
          latest =>
            latest.Apollo.length > 0 && latest.Sunrise.length > 0 && latest.Woodstock.length > 0,
        ),
        this.getEndpoints.monitorSingleFire(),
        takeUntil(this.onDestroy$),
      )
      .subscribe(latest => {
        this.woodstockEnvs = latest.Woodstock;
        this.apolloEnvs = latest.Apollo;
        this.sunriseEnvs = latest.Sunrise;

        this.formControls.woodstockEnvs.setValue([this.woodstockEnvs[0]]);
        this.formControls.sunriseEnvs.setValue([this.sunriseEnvs[0]]);
        this.formControls.apolloEnvs.setValue([this.apolloEnvs[0]]);
        this.formControls.xuids.setValue('');
      });
  }

  /** Gets list of all selected woodstock environments. */
  public get woodstockEnvironments(): string[] {
    return this.formControls.woodstockEnvs.value || [];
  }

  /** Gets list of all selected sunrise environments. */
  public get sunriseEnvironments(): string[] {
    return this.formControls.sunriseEnvs.value || [];
  }

  /** Gets list of all selected apollo environments. */
  public get apolloEnvironments(): string[] {
    return this.formControls.apolloEnvs.value || [];
  }

  /** Emits bulk ban history input changes. */
  public emitInputChanges(): void {
    if (!this.isLookupReady()) {
      return;
    }

    const woodstockEnvironments: string[] = this.woodstockEnvironments;
    const sunriseEnvironments: string[] = this.sunriseEnvironments;
    const apolloEnvironments: string[] = this.apolloEnvironments;
    const xuidsInput: string = this.formControls.xuids.value;

    const xuids = tryParseBigNumbers(xuidsInput);

    this.selection.emit({
      xuids: xuids,
      woodstockEnvironments: woodstockEnvironments,
      sunriseEnvironments: sunriseEnvironments,
      apolloEnvironments: apolloEnvironments,
    } as BulkBanReviewInput);
  }

  /** Returns true if XUID lookup is ready. */
  public isLookupReady(): boolean {
    const woodstockEnvs = this.woodstockEnvironments;
    const sunriseEnvs = this.sunriseEnvironments;
    const apolloEnvs = this.apolloEnvironments;
    const atLeastOneEnvFound =
      woodstockEnvs.length > 0 || sunriseEnvs.length > 0 || apolloEnvs.length > 0;

    return this.formGroup?.valid && atLeastOneEnvFound;
  }
}
