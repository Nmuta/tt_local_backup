import { Component, forwardRef, Input } from '@angular/core';
import { KustoCar } from '@models/kusto-car';
import { Observable } from 'rxjs';
import { MakeModelAutocompleteBaseComponent } from '../make-model-autocomplete.base.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

/** Service contract for make-model autocomplete component.*/
export interface MakeModelAutocompleteServiceContract {
  /** Gets the detailed car list. */
  getDetailedKustoCars$(): Observable<KustoCar[]>;
}

/** Component for Sunrise make & model autocomplete. */
@Component({
  selector: 'make-model-autocomplete',
  templateUrl: '../make-model-autocomplete.component.html',
  styleUrls: ['../make-model-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MakeModelAutocompleteComponent),
      multi: true,
    },
  ],
})
export class MakeModelAutocompleteComponent extends MakeModelAutocompleteBaseComponent {
  @Input() public service: MakeModelAutocompleteServiceContract;

  /** Gets master inventory list */
  public getKustoCars$(): Observable<KustoCar[]> {
    return this.service.getDetailedKustoCars$();
  }
}
