import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { JsonTableResult } from '@models/json-table-result';
import { KustoQuery } from '@models/kusto/kusto-query';
import { KustoService } from '@services/kusto';
import { NEVER } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

/** Displays the kusto query feature. */
@Component({
  selector: 'kusto',
  templateUrl: './kusto.component.html',
  styleUrls: ['./kusto.component.scss'],
})
export class KustoComponent extends BaseComponent {
  /** Master Inventory autocomplete varsiables */
  public kustoQueryForm: FormGroup = this.formBuilder.group({
    queryInput: new FormControl('', Validators.required),
  });

  public queryResponse: JsonTableResult<unknown>[];

  /** True while waiting on a request. */
  public isLoading = false;
  /** The error received while loading. */
  public loadError: unknown;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly kustoService: KustoService,
  ) {
    super();
  }

  /** Sets the provided query to the textarea input box. */
  public setQueryToInput($event: KustoQuery): void {
    this.kustoQueryForm.setValue({
      queryInput: $event.query,
    });
  }

  /** Runs the query against Kusto. */
  public runQuery(): void {
    const queryInputValue = this.kustoQueryForm.controls['queryInput'].value;
    this.loadError = undefined;
    this.queryResponse = undefined;

    if (this.isLoading || queryInputValue === '') {
      return;
    }

    this.isLoading = true;

    this.kustoService
      .postRunKustoQuery(queryInputValue)
      .pipe(
        takeUntil(this.onDestroy$),
        catchError(error => {
          this.isLoading = false;
          this.loadError = error;
          return NEVER;
        }),
      )
      .subscribe(response => {
        this.isLoading = false;
        this.queryResponse = response.map(item => {
          const tableResult = item as JsonTableResult<unknown>;
          tableResult.showErrorInTable = false;
          return tableResult;
        });
      });
  }

  /** Clears the textarea input. */
  public clearInput(): void {
    this.kustoQueryForm.reset();
  }
}
