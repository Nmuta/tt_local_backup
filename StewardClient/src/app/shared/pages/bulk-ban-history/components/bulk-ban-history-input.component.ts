import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApolloEndpointKey, SunriseEndpointKey } from '@models/enums';
import BigNumber from 'bignumber.js';
import { uniqBy } from 'lodash';

export type BulkBanHistoryInput = {
  xuids: BigNumber[];
  sunriseEnvironments: SunriseEndpointKey[];
  apolloEnvironments: ApolloEndpointKey[];
};

/** The bulk ban history input component. */
@Component({
  selector: 'bulk-ban-history-input',
  templateUrl: './bulk-ban-history-input.component.html',
  styleUrls: ['./bulk-ban-history-input.component.scss'],
})
export class BulkBanHistoryInputComponent {
  @Output() selection = new EventEmitter<BulkBanHistoryInput>();

  public sunriseEnvs: SunriseEndpointKey[] = [SunriseEndpointKey.Retail];
  public apolloEnvs: ApolloEndpointKey[] = [ApolloEndpointKey.Retail];

  public formControls = {
    sunriseEnvs: new FormControl([this.sunriseEnvs[0]]),
    apolloEnvs: new FormControl([this.apolloEnvs[0]]),
    xuids: new FormControl('', Validators.required),
  };

  public formGroup = new FormGroup({
    xuids: this.formControls.xuids,
  });

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

    return this.formGroup.valid && atLeastOneEnvFound;
  }
}
