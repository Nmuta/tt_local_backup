import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitleCodeName } from '@models/enums';
import { DetailedCar } from '@models/detailed-car';
import { DefaultUGCFilters, UGCAccessLevel, UGCFilters, UGCOrderBy } from '@models/ugc-filters';
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
export abstract class UGCFiltersBaseComponent extends BaseComponent {
  @Output() public changes = new EventEmitter<UGCFilters>();

  public accessLevelOptions = keys(UGCAccessLevel) as UGCAccessLevel[];
  public orderByOptions = keys(UGCOrderBy) as UGCOrderBy[];

  public formControls = {
    makeModelInput: new FormControl(null),
    keyword: new FormControl(''),
    accessLevel: new FormControl(DefaultUGCFilters.accessLevel, Validators.required),
    orderBy: new FormControl(DefaultUGCFilters.orderBy, Validators.required),
  };

  /** UGC filters form group. */
  public formGroup: FormGroup = new FormGroup(this.formControls);
  public stateGroupOptions$: Observable<MakeModelFilterGroup[]>;
  public makeModelFilterGroups: MakeModelFilterGroup[];

  public abstract gameTitle: GameTitleCodeName;

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
    } as UGCFilters);
  }

  /** Clears the keyword input and outputs the updated search filters */
  public clearKeyword(): void {
    this.formControls.keyword.setValue(null);
    this.searchFilters();
  }
}
