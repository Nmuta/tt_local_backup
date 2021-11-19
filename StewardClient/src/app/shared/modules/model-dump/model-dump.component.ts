import { Component, forwardRef, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { BehaviorSubject } from 'rxjs';
import {
  extractFlags,
  extractNumbers,
  extractStrings,
  extractDates,
  extractDurations,
  ExtractedModel,
} from './helpers';

export const MODEL_DUMP_PROCESSED_MODEL$ = 'MODEL_DUMP_PROCESSED_MODEL$';

/**
 * Entry component for rapidly producing a page layout given an unprocessed model.
 * This component performs the processing and displays any errors.
 * The other components within this module should be placed within one of these.
 */
@Component({
  selector: 'model-dump',
  templateUrl: './model-dump.component.html',
  styleUrls: ['./model-dump.component.scss'],
  providers: [
    {
      provide: MODEL_DUMP_PROCESSED_MODEL$,
      deps: [forwardRef(() => ModelDumpComponent)],
      useFactory: mdc => mdc.processedModel$,
    },
  ],
})
export class ModelDumpComponent extends BaseComponent implements OnChanges {
  @Input() model: unknown;

  public processedModel$ = new BehaviorSubject<ExtractedModel>(undefined);
  public processedModel: ExtractedModel = undefined;

  constructor() {
    super();
    this.onDestroy$.subscribe(() => this.processedModel$.complete());
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(): void {
    this.processedModel = undefined;
    this.processedModel = {
      extractedFlags: extractFlags(this.model),
      extractedNumbers: extractNumbers(this.model),
      extractedStrings: extractStrings(this.model),
      extractedDates: extractDates(this.model),
      extractedDurations: extractDurations(this.model),
    };
    this.processedModel$.next(this.processedModel);
  }
}
