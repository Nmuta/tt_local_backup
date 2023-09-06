import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { EMPTY } from 'rxjs';
import { LspGroup, LspGroups } from '@models/lsp-group';
import { catchError, takeUntil, filter, map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { ControlValueAccessor, UntypedFormControl } from '@angular/forms';
import { GameTitleCodeName } from '@models/enums';
import BigNumber from 'bignumber.js';

/** The shared top-level navbar. */
@Component({
  template: '',
})
export abstract class LspGroupSelectionBaseComponent
  extends BaseComponent
  implements OnInit, ControlValueAccessor
{
  /** Preselects a group id in dropdown if id exists. */
  @Input() preselectGroupId: BigNumber;

  /** Lsp Groups. */
  public lspGroups: LspGroups = [];
  /** Selected lsp group. */
  public selectedLspGroup: LspGroup = null;

  /** Mat-Autocomplete form controls */
  public autocompleteControl = new UntypedFormControl();
  public filteredLspGroupOptions$: Observable<LspGroups>;
  public lspInputValue: LspGroup = null;

  /** True while waiting on a request. */
  public isLoading = false;
  /** The error received while loading. */
  public loadError: unknown;

  public showPreselectError: boolean = false;

  public abstract title: GameTitleCodeName;

  constructor() {
    super();
  }

  /** Child(title) class should implement. */
  public abstract dispatchLspGroupStoreAction(): void;

  /** Child(title) class should implement. */
  public abstract lspGroupSelector$(): Observable<LspGroups>;

  /** Initialization hook. */
  public ngOnInit(): void {
    this.isLoading = true;
    this.dispatchLspGroupStoreAction();
    const selector$ = this.lspGroupSelector$();
    selector$
      .pipe(
        filter(data => data.length > 0),
        catchError(error => {
          this.isLoading = false;
          this.loadError = error;
          return EMPTY;
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe((data: LspGroups) => {
        this.isLoading = false;
        this.lspGroups = data;

        if (!!this.preselectGroupId) {
          const foundGroup = this.lspGroups.find(group =>
            group.id.isEqualTo(this.preselectGroupId),
          );
          if (!!foundGroup) {
            this.writeValue(foundGroup);
            this.emitNewSelection(foundGroup);
          } else {
            this.showPreselectError = true;
          }
        }
      });

    this.filteredLspGroupOptions$ = this.autocompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.name)),
      map(name => (name ? this.filter(name) : this.lspGroups.slice())),
    );
  }

  /** Clear the current selection. */
  public clearSelection(): void {
    this.lspInputValue = null;
    this.emitNewSelection(null);
  }

  /** New LSP Group selected event */
  public emitNewSelection(value: LspGroup): void {
    this.showPreselectError = false;
    this.onChangeFunction(value);
  }

  /** Mat option display */
  public displayFn(lspGroup: LspGroup): string {
    return lspGroup && lspGroup.name ? lspGroup.name : '';
  }

  /** Form control hook. */
  public writeValue(obj: LspGroup): void {
    this.selectedLspGroup = obj;
    this.lspInputValue = obj;
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
