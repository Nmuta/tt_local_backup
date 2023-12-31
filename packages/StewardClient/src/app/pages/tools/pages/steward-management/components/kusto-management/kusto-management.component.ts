import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitleCodeName } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import { KustoQuery } from '@models/kusto';
import { KustoService } from '@services/kusto';
import { keys } from 'lodash';
import { EMPTY, Observable } from 'rxjs';
import { catchError, take, takeUntil } from 'rxjs/operators';

/** Displays the kusto management tool. */
@Component({
  selector: 'kusto-management',
  templateUrl: './kusto-management.component.html',
  styleUrls: ['./kusto-management.component.scss'],
})
export class KustoManagementComponent extends BaseComponent {
  /** Game Titles */
  public gameTitles = keys(GameTitleCodeName).map(x => GameTitleCodeName[x]);

  /** Kusto query submit form */
  public querySubmitForm: UntypedFormGroup = this.formBuilder.group({
    name: new UntypedFormControl('', Validators.required),
    title: new UntypedFormControl('', Validators.required),
    query: new UntypedFormControl('', Validators.required),
  });

  public editKustoQueryId: GuidLikeString;

  /** True while waiting on a request. */
  public isLoading = false;
  /** The error received while loading. */
  public loadError: unknown;

  constructor(
    private readonly kustoService: KustoService,
    private readonly formBuilder: UntypedFormBuilder,
  ) {
    super();
  }

  /** Kusto query selected. */
  public selectedQuery(event: KustoQuery): void {
    if (!event) {
      return;
    }

    this.editKustoQueryId = event.id;
    this.querySubmitForm.controls['name'].setValue(event.name);
    this.querySubmitForm.controls['title'].setValue(event.title);
    this.querySubmitForm.controls['query'].setValue(event.query);
  }

  /** Submit query. */
  public submitQuery(): void {
    this.isLoading = true;
    const name = this.querySubmitForm.controls['name'].value;
    const title = this.querySubmitForm.controls['title'].value;
    const query = this.querySubmitForm.controls['query'].value;

    const kustoQuery: KustoQuery = {
      id: undefined,
      name: name,
      title: title,
      query: query,
    };

    const request$ = !this.editKustoQueryId
      ? this.addNewKustoQuery$(kustoQuery)
      : this.editKustoQuery$(this.editKustoQueryId, kustoQuery);
    request$
      .pipe(
        catchError(error => {
          this.isLoading = false;
          this.loadError = error;
          return EMPTY;
        }),
        take(1),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        this.isLoading = false;
        this.editKustoQueryId = undefined;
        this.querySubmitForm.reset();

        const resetBtn = document.getElementById('reload-kusto-queries-btn');
        if (resetBtn) resetBtn.click();
      });
  }

  /** Clear input. */
  public deleteQuery(): void {
    if (!this.editKustoQueryId) {
      return;
    }

    this.isLoading = true;
    this.kustoService
      .deleteKustoQuery$(this.editKustoQueryId)
      .pipe(
        catchError(error => {
          this.isLoading = false;
          this.loadError = error;
          return EMPTY;
        }),
        take(1),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        this.isLoading = false;
        this.editKustoQueryId = undefined;
        this.querySubmitForm.reset();

        const resetBtn = document.getElementById('reload-kusto-queries-btn');
        if (resetBtn) {
          resetBtn.click();
        }
      });
  }

  /** Clear input. */
  public clearInput(): void {
    this.editKustoQueryId = undefined;
    this.querySubmitForm.reset();
  }

  /** Sends a request to add a new query */
  private addNewKustoQuery$(kustoQuery: KustoQuery): Observable<void> {
    return this.kustoService.postSaveNewKustoQuery$(kustoQuery);
  }

  /** Sends a request to add a new query */
  private editKustoQuery$(kustoQueryId: GuidLikeString, kustoQuery: KustoQuery): Observable<void> {
    return this.kustoService.putReplaceKustoQuery$(kustoQueryId, kustoQuery);
  }
}
