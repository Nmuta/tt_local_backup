import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { Select } from '@ngxs/store';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import {
  EndpointKeyMemoryModel,
  EndpointKeyMemoryState,
} from '@shared/state/endpoint-key-memory/endpoint-key-memory.state';
import BigNumber from 'bignumber.js';
import { uniqBy } from 'lodash';
import { Observable } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

export type BulkBanHistoryInput = {
  xuids: BigNumber[];
  sunriseEnvironments: string[];
  apolloEnvironments: string[];
};

/** The bulk ban history input component. */
@Component({
  selector: 'bulk-ban-history-input',
  templateUrl: './bulk-ban-history-input.component.html',
  styleUrls: ['./bulk-ban-history-input.component.scss'],
})
export class BulkBanHistoryInputComponent extends BaseComponent implements OnInit {
  @Select(EndpointKeyMemoryState) public endpointKeys$: Observable<EndpointKeyMemoryModel>;
  @Output() selection = new EventEmitter<BulkBanHistoryInput>();

  public sunriseEnvs: string[];
  public apolloEnvs: string[];
  public getEndpoints = new ActionMonitor('Retrieve Endpoint Keys');

  public formControls = {
    sunriseEnvs: new FormControl([]),
    apolloEnvs: new FormControl([]),
    xuids: new FormControl('', Validators.required),
  };

  public formGroup = new FormGroup(this.formControls);

  /** Initialization hook. */
  public ngOnInit(): void {
    this.getEndpoints = new ActionMonitor(this.getEndpoints.dispose().label);

    this.endpointKeys$
      .pipe(
        first(latest => {
          return latest.Apollo.length > 0 && latest.Sunrise.length > 0;
        }),
        this.getEndpoints.monitorSingleFire(),
        takeUntil(this.onDestroy$),
      )
      .subscribe(latest => {
        this.apolloEnvs = latest.Apollo;
        this.sunriseEnvs = latest.Sunrise;

        this.formControls.sunriseEnvs.setValue([this.sunriseEnvs[0]]);
        this.formControls.apolloEnvs.setValue([this.apolloEnvs[0]]);
        this.formControls.xuids.setValue('');
      });
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

    const sunriseEnvironments: string[] = this.sunriseEnvironments;
    const apolloEnvironments: string[] = this.apolloEnvironments;
    const xuidsInput: string = this.formControls.xuids.value;

    let xuids = xuidsInput
      .replace(/\n|\r/g, ', ') // Convert new lines to commas
      .split(/,|\r|\n/) // Split on commas
      .map(x => new BigNumber(x.trim())) // Try to convered string to BigNumber
      .filter((x: BigNumber) => !!x && !x.isNaN()); // Ignore null/undefined or invalid BigNumbers in the list

    // Remove duplicates
    xuids = uniqBy(xuids, xuid => xuid.toString());

    this.selection.emit({
      xuids: xuids,
      sunriseEnvironments: sunriseEnvironments,
      apolloEnvironments: apolloEnvironments,
    } as BulkBanHistoryInput);
  }

  /** Returns true if XUID lookup is ready. */
  public isLookupReady(): boolean {
    const sunriseEnvs = this.sunriseEnvironments;
    const apolloEnvs = this.apolloEnvironments;
    const atLeastOneEnvFound = sunriseEnvs.length > 0 || apolloEnvs.length > 0;

    return this.formGroup?.valid && atLeastOneEnvFound;
  }
}
