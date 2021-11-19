import { Component, Injector } from '@angular/core';
import { ModelDumpChildBaseComponent } from '../helpers/model-dump-child.base.component';

/**
 * Renders a table of all source data that looks like a XUID.
 */
@Component({
  selector: 'model-dump-xuids',
  templateUrl: './model-dump-xuids.component.html',
  styleUrls: ['./model-dump-xuids.component.scss'],
})
export class ModelDumpXuidsComponent extends ModelDumpChildBaseComponent {
  constructor(protected readonly injector: Injector) {
    super(injector);
  }
}
