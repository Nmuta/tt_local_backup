import { Component, forwardRef } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { KustoCar } from '@models/kusto-car';
import { SunriseService } from '@services/sunrise';
import { Observable } from 'rxjs';
import { MakeModelAutocompleteBaseComponent } from '../make-model-autocomplete.base.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

/** Component for Sunrise make & model autocomplete. */
@Component({
  selector: 'sunrise-make-model-autocomplete',
  templateUrl: '../make-model-autocomplete.component.html',
  styleUrls: ['../make-model-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SunriseMakeModelAutocompleteComponent),
      multi: true,
    },
  ],
})
export class SunriseMakeModelAutocompleteComponent extends MakeModelAutocompleteBaseComponent {
  public gameTitle = GameTitleCodeName.FH4;

  constructor(private readonly sunriseService: SunriseService) {
    super();
  }

  /** Gets master inventory list */
  public getKustoCars$(): Observable<KustoCar[]> {
    return this.sunriseService.getDetailedKustoCars$();
  }
}
