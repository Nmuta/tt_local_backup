import { Component, forwardRef } from '@angular/core';
import { SimpleCar } from '@models/cars';
import { WoodstockService } from '@services/woodstock';
import { Observable } from 'rxjs';
import { MakeModelAutocompleteBaseComponent } from '../make-model-autocomplete.base.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

/** Component for Woodstock make & model autocomplete. */
@Component({
  selector: 'woodstock-make-model-autocomplete',
  templateUrl: '../make-model-autocomplete.component.html',
  styleUrls: ['../make-model-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WoodstockMakeModelAutocompleteComponent),
      multi: true,
    },
  ],
})
export class WoodstockMakeModelAutocompleteComponent extends MakeModelAutocompleteBaseComponent {
  constructor(private readonly woodstockService: WoodstockService) {
    super();
  }

  /** Gets master inventory list */
  public getSimpleCars$(): Observable<SimpleCar[]> {
    return this.woodstockService.getSimpleCars$(this.pegasusSlotId);
  }
}
