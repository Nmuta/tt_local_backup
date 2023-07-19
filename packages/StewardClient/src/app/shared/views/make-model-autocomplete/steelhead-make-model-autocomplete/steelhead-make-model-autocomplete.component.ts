import { Component, forwardRef } from '@angular/core';
import { SimpleCar } from '@models/cars';
import { Observable } from 'rxjs';
import { MakeModelAutocompleteBaseComponent } from '../make-model-autocomplete.base.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SteelheadItemsService } from '@services/api-v2/steelhead/items/steelhead-items.service';

/** Component for Steelhead make & model autocomplete. */
@Component({
  selector: 'steelhead-make-model-autocomplete',
  templateUrl: '../make-model-autocomplete.component.html',
  styleUrls: ['../make-model-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SteelheadMakeModelAutocompleteComponent),
      multi: true,
    },
  ],
})
export class SteelheadMakeModelAutocompleteComponent extends MakeModelAutocompleteBaseComponent {
  constructor(private readonly steelheadItemsService: SteelheadItemsService) {
    super();
  }

  /** Gets master inventory list */
  public getSimpleCars$(): Observable<SimpleCar[]> {
    return this.steelheadItemsService.getSimpleCars$(this.pegasusSlotId);
  }
}
