import { Component, Injector } from '@angular/core';
import { ModelDumpChildBaseComponent } from '../helpers/model-dump-child.base.component';

/**
 * Renders a list of the model's flags with the standard flag component.
 */
@Component({
  selector: 'model-dump-flags',
  templateUrl: './model-dump-flags.component.html',
  styleUrls: ['./model-dump-flags.component.scss'],
})
export class ModelDumpFlagsComponent extends ModelDumpChildBaseComponent {
  constructor(protected readonly injector: Injector) {
    super(injector);
  }
}
