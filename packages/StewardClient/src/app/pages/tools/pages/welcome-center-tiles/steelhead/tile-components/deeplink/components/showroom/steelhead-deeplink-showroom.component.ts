import { Component, forwardRef } from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  UntypedFormControl,
  UntypedFormGroup,
  AbstractControl,
  ValidationErrors,
  ControlValueAccessor,
  Validator,
} from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { collectErrors } from '@helpers/form-group-collect-errors';
import {
  DeeplinkDestination,
  DestinationType,
  ShowroomDestination,
  ShowroomSettingType,
} from '@models/welcome-center';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { combineLatest, filter, map, pairwise, startWith, takeUntil } from 'rxjs';
import { SteelheadCarsService } from '@services/api-v2/steelhead/cars/steelhead-cars.service';

/** The deeplink showroom component. */
@Component({
  selector: 'steelhead-deeplink-showroom',
  templateUrl: './steelhead-deeplink-showroom.component.html',
  styleUrls: ['../../steelhead-deeplink-tile.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DeeplinkShowroomComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DeeplinkShowroomComponent),
      multi: true,
    },
  ],
})
export class DeeplinkShowroomComponent
  extends BaseComponent
  implements ControlValueAccessor, Validator
{
  public showroomSetting: string[] = [
    ShowroomSettingType.Homepage,
    ShowroomSettingType.Car,
    ShowroomSettingType.Manufacturer,
  ];
  public showroomCars: Map<string, string>;
  public showroomManufacturers: Map<string, string>;
  public showroomSettingTypes = ShowroomSettingType;
  public referenceDataMonitor = new ActionMonitor('GET Reference Data');

  public formControls = {
    showroomSettingType: new UntypedFormControl(null),
    showroomCar: new UntypedFormControl(null),
    showroomManufacturer: new UntypedFormControl(null),
  };

  public formGroup: UntypedFormGroup = new UntypedFormGroup(this.formControls);

  constructor(steelheadCarsService: SteelheadCarsService) {
    super();

    const getShowroomCars$ = steelheadCarsService.getCarsReference$();
    const getShowroomManufacturers$ = steelheadCarsService.getCarManufacturers$();

    this.referenceDataMonitor = this.referenceDataMonitor.repeat();
    combineLatest([getShowroomCars$, getShowroomManufacturers$])
      .pipe(this.referenceDataMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(([cars, manufacturers]) => {
        this.showroomCars = cars;
        this.showroomManufacturers = manufacturers;
      });
  }

  /** Form control hook. */
  public writeValue(data: DeeplinkDestination): void {
    const showroomDestination = data as ShowroomDestination;
    this.formControls.showroomSettingType.setValue(showroomDestination.settingType);

    if (showroomDestination.settingType == ShowroomSettingType.Car) {
      this.formControls.showroomCar.setValue(showroomDestination.car);
    }
    if (showroomDestination.settingType == ShowroomSettingType.Manufacturer) {
      this.formControls.showroomManufacturer.setValue(showroomDestination.manufacturer);
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: ShowroomDestination) => void): void {
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
      .subscribe(() => {
        const showroomDestination = {
          settingType: this.formControls.showroomSettingType.value,
          destinationType: DestinationType.Showroom,
        } as ShowroomDestination;

        if (showroomDestination.settingType == ShowroomSettingType.Car) {
          showroomDestination.car = this.formControls.showroomCar.value;
        }
        if (showroomDestination.settingType == ShowroomSettingType.Manufacturer) {
          showroomDestination.manufacturer = this.formControls.showroomManufacturer.value;
        }

        fn(showroomDestination);
      });
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
}
