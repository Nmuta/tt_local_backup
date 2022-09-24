import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { DefaultUgcFilters, UgcAccessLevel, UgcFilters, UgcOrderBy } from '@models/ugc-filters';
import { DetailedCar } from '@models/detailed-car';
import BigNumber from 'bignumber.js';
import { keys } from 'lodash';
import { Observable } from 'rxjs';

export type MakeModelFilterGroup = {
  category: string;
  items: DetailedCar[];
};

/** A base component for ugcs filters. */
@Component({
  template: '',
})
export abstract class UgcFiltersBaseComponent extends BaseComponent {
  /** REVIEW-COMMENT: Output when UGC filters changes. */
  @Output() public changes = new EventEmitter<UgcFilters>();

  public accessLevelOptions = keys(UgcAccessLevel) as UgcAccessLevel[];
  public orderByOptions = keys(UgcOrderBy) as UgcOrderBy[];

  public formControls = {
    makeModelInput: new FormControl(null),
    keyword: new FormControl(''),
    accessLevel: new FormControl(DefaultUgcFilters.accessLevel, Validators.required),
    orderBy: new FormControl(DefaultUgcFilters.orderBy, Validators.required),
  };

  /** UGC filters form group. */
  public formGroup: FormGroup = new FormGroup(this.formControls);
  public stateGroupOptions$: Observable<MakeModelFilterGroup[]>;
  public makeModelFilterGroups: MakeModelFilterGroup[];

  public abstract gameTitle: GameTitle;

  constructor() {
    super();
  }

  /** Outputs new ugc search filters. */
  public searchFilters(): void {
    const carFilter = this.formControls.makeModelInput.value as DetailedCar;
    let carId: BigNumber = undefined;
    let makeId: BigNumber = undefined;

    if (!!carFilter) {
      carId = !carFilter.makeOnly ? carFilter.id : undefined;
      makeId = carFilter.makeOnly ? carFilter.makeId : undefined;
    }

    this.changes.emit({
      carId: carId,
      makeId: makeId,
      keyword: this.formControls.keyword.value,
      accessLevel: this.formControls.accessLevel.value,
      orderBy: this.formControls.orderBy.value,
    } as UgcFilters);
  }

  /** Clears the keyword input and outputs the updated search filters */
  public clearKeyword(): void {
    this.formControls.keyword.setValue(null);
    this.searchFilters();
  }
}
