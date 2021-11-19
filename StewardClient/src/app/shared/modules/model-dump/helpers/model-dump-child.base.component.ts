import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { NEVER, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ExtractedModel } from '../helpers';
import { MODEL_DUMP_PROCESSED_MODEL$ } from '../model-dump.component';

/**
 * A common base component for Model Dump children.
 * This handles the injection process, observable lifecycle, and tracking the latest processedModel.
 */
@Component({ template: '' })
export class ModelDumpChildBaseComponent extends BaseComponent implements OnInit {
  public processedModel: ExtractedModel = undefined;
  protected processedModel$: Observable<ExtractedModel> = NEVER;

  constructor(protected readonly injector: Injector) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.processedModel$ = this.injector.get(MODEL_DUMP_PROCESSED_MODEL$, null) as Observable<
      ExtractedModel
    >;
    this.processedModel$.pipe(takeUntil(this.onDestroy$)).subscribe(v => {
      this.processedModel = v;
    });
  }
}
