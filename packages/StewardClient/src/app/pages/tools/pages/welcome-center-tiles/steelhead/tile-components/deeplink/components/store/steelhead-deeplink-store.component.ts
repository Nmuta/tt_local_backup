import { Component, forwardRef } from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl,
  FormGroup,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { collectErrors } from '@helpers/form-group-collect-errors';
import {
  DeeplinkDestination,
  DestinationType,
  StoreDestination,
  StoreSettingType,
} from '@models/welcome-center';
import { SteelheadStoreService } from '@services/api-v2/steelhead/store/steelhead-store.service';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { filter, map, pairwise, startWith, takeUntil } from 'rxjs';
import { BaseTileFormValue } from '../../../steelhead-general-tile.component';

/** The deeplink store component. */
@Component({
  selector: 'steelhead-deeplink-store',
  templateUrl: './steelhead-deeplink-store.component.html',
  styleUrls: ['../../steelhead-deeplink-tile.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DeeplinkStoreComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DeeplinkStoreComponent),
      multi: true,
    },
  ],
})
export class DeeplinkStoreComponent extends BaseComponent {
  public storeSetting: string[] = [StoreSettingType.Homepage, StoreSettingType.Product];
  public storeProducts: Map<string, string>;
  public storeSettingTypes = StoreSettingType;
  public referenceDataMonitor = new ActionMonitor('GET Reference Data');

  public formControls = {
    storeSettingType: new FormControl(null),
    storeProduct: new FormControl(null),
  };

  public formGroup: FormGroup = new FormGroup(this.formControls);

  constructor(steelheadStoreService: SteelheadStoreService) {
    super();

    this.referenceDataMonitor = this.referenceDataMonitor.repeat();

    steelheadStoreService
      .getStoreEntitlements$()
      .pipe(this.referenceDataMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(entitlements => {
        this.storeProducts = entitlements;
      });
  }

  /** Form control hook. */
  public writeValue(data: DeeplinkDestination): void {
    const storeDestination = data as StoreDestination;
    this.formControls.storeSettingType.setValue(storeDestination.settingType);

    if (storeDestination.settingType == StoreSettingType.Product) {
      this.formControls.storeProduct.setValue(storeDestination.product);
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: BaseTileFormValue) => void): void {
    this.formGroup.valueChanges
      .pipe(
        startWith(null),
        pairwise(),
        filter(([prev, cur]) => {
          return prev !== cur;
        }),
        map(([_prev, cur]) => cur),
        takeUntil(this.onDestroy$),
      )
      .subscribe(fn);
  }

  /** Form control hook. */
  public registerOnTouched(_fn: () => void): void {
    /** empty */
  }

  /** Form control hook. */
  public setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.formGroup.disable();
    } else {
      this.formGroup.enable();
    }
  }

  /** Form control hook. */
  public validate(_: AbstractControl): ValidationErrors | null {
    if (this.formGroup.invalid) {
      return collectErrors(this.formGroup);
    }

    return null;
  }

  /** Set the fields of a store destination using the form values. */
  public mapFormToDestination() {
    const storeDestination = {
      settingType: this.formControls.storeSettingType.value,
      destinationType: DestinationType.Store,
    } as StoreDestination;

    if (storeDestination.settingType == StoreSettingType.Product) {
      storeDestination.product = this.formControls.storeProduct.value;
    }

    return storeDestination;
  }
}
