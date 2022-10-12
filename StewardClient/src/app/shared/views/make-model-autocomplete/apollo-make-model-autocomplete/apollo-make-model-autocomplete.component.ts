import { Component, forwardRef } from '@angular/core';
import { SimpleCar } from '@models/cars';
import { ApolloService } from '@services/apollo';
import { Observable } from 'rxjs';
import { MakeModelAutocompleteBaseComponent } from '../make-model-autocomplete.base.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

/** Component for Apollo make & model autocomplete. */
@Component({
  selector: 'apollo-make-model-autocomplete',
  templateUrl: '../make-model-autocomplete.component.html',
  styleUrls: ['../make-model-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ApolloMakeModelAutocompleteComponent),
      multi: true,
    },
  ],
})
export class ApolloMakeModelAutocompleteComponent extends MakeModelAutocompleteBaseComponent {
  constructor(private readonly apolloService: ApolloService) {
    super();
  }

  /** Gets master inventory list */
  public getSimpleCars$(): Observable<SimpleCar[]> {
    return this.apolloService.getSimpleCars$();
  }
}
