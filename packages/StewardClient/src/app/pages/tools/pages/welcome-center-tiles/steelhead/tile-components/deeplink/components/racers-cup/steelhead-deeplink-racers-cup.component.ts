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
import { DeeplinkDestination, DestinationType, RacersCupDestination } from '@models/welcome-center';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { filter, map, pairwise, startWith, takeUntil } from 'rxjs';
import { BaseTileFormValue } from '../../../steelhead-general-tile.component';
import { SteelheadRacersCupService } from '@services/api-v2/steelhead/racers-cup/steelhead-racers-cup.service';

/** The deeplink racers cup component. */
@Component({
  selector: 'steelhead-deeplink-racers-cup',
  templateUrl: './steelhead-deeplink-racers-cup.component.html',
  styleUrls: ['../../steelhead-deeplink-tile.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DeeplinkRacersCupComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DeeplinkRacersCupComponent),
      multi: true,
    },
  ],
})
export class DeeplinkRacersCupComponent extends BaseComponent {
  public racersCupSeries: Map<string, string>;
  public referenceDataMonitor = new ActionMonitor('GET Reference Data');

  public formControls = {
    racersCupSeries: new FormControl(null),
  };

  public formGroup: FormGroup = new FormGroup(this.formControls);

  constructor(steelheadRacersCupService: SteelheadRacersCupService) {
    super();

    this.referenceDataMonitor = this.referenceDataMonitor.repeat();

    steelheadRacersCupService
      .getRacersCupSeries$()
      .pipe(this.referenceDataMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(series => {
        this.racersCupSeries = series;
      });
  }

  /** Form control hook. */
  public writeValue(data: DeeplinkDestination): void {
    this.formControls.racersCupSeries.setValue((data as RacersCupDestination).series);
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

  /** Set the fields of a racers cup destination using the form values. */
  public mapFormToDestination() {
    return {
      series: this.formControls.racersCupSeries.value,
      destinationType: DestinationType.RacersCup,
    } as RacersCupDestination;
  }
}
