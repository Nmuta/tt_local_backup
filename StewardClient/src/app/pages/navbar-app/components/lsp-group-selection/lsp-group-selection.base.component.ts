import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { NEVER } from 'rxjs';
import { LspGroup, LspGroups } from '@models/lsp-group';
import { catchError, takeUntil, tap, filter, map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { ControlValueAccessor, FormControl } from '@angular/forms';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { GameTitleCodeName } from '@models/enums';

/** The shared top-level navbar. */
@Component({
  template: '',
})
export abstract class LspGroupSelectionBaseComponent extends BaseComponent implements OnInit, ControlValueAccessor {
  /** Lsp Groups. */
  public lspGroups: LspGroups = [];
  /** Selected lsp group. */
  public selectedLspGroup: LspGroup = null;

  /** Mat-Autocomplete form controls */
  public autocompleteControl = new FormControl();
  public filteredLspGroupOptions$: Observable<LspGroups>;
  public lspInputValue: string = '';

  /** Font awesome icons */
  public trashIcon = faTrashAlt;

  /** True while waiting on a request. */
  public isLoading = false;
  /** The error received while loading. */
  public loadError: unknown;

  public abstract title: GameTitleCodeName;

  constructor() {
    super();
  }

  /** Child(title) class should implement. */
  public abstract dispatchLspGroupStoreAction(): void;

  /** Child(title) class should implement. */
  public abstract lspGroupSelector(): Observable<LspGroups>;

  /** Initialization hook. */
  public ngOnInit(): void {
    this.isLoading = true;
    this.dispatchLspGroupStoreAction();
    const selector$ = this.lspGroupSelector();
    selector$
      .pipe(
        takeUntil(this.onDestroy$),
        filter(data => data.length > 0),
        tap((data: LspGroups) => {
          this.isLoading = false;
          this.lspGroups = data;
        }),
        catchError(error => {
          this.isLoading = false;
          this.loadError = error;
          return NEVER;
        }),
      )
      .subscribe();

    this.filteredLspGroupOptions$ = this.autocompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => (name ? this.filter(name) : this.lspGroups.slice())),
    );
  }

  /** Clear the current selection. */
  public clearSelection(): void {
    this.lspInputValue = '';
    this.emitNewSelection(null);
  }

  /** New LSP Group selected event */
  public emitNewSelection(value: LspGroup): void {
    this.onChangeFunction(value);
  }

  /** Mat option display */
  public displayFn(lspGroup: LspGroup): string {
    return lspGroup && lspGroup.name ? lspGroup.name : '';
  }

  /** Form control hook. */
  public writeValue(obj: LspGroup): void {
    this.selectedLspGroup = obj;
  }

  /** Form control hook. */
  public registerOnChange(fn: (value: LspGroup) => void): void {
    this.onChangeFunction = fn;
  }

  /** Form control hook. */
  public registerOnTouched(_fn: unknown): void {
    /** empty */
  }

  /** Autocomplete filter */
  private filter(value: string): LspGroups {
    const filterValue = value.toLowerCase();
    return this.lspGroups.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private onChangeFunction = (_value: LspGroup) => {
    /* empty */
  };
}
