import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitleCodeName } from '@models/enums';
import { UgcSearchFilters, UgcType } from '@models/ugc-filters';
import { DetailedCar } from '@models/detailed-car';
import BigNumber from 'bignumber.js';
import { keys } from 'lodash';
import { Observable } from 'rxjs';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { IdentityResultAlpha } from '@models/identity-query.model';

export type MakeModelFilterGroup = {
  category: string;
  items: DetailedCar[];
};

/** A component for ugc search filters. */
@Component({
  selector: 'ugc-search-filters',
  templateUrl: 'ugc-search-filters.component.html',
  styleUrls: ['ugc-search-filters.component.scss'],
})
export class UgcSearchFiltersComponent extends BaseComponent {
  @Output() public changes = new EventEmitter<UgcSearchFilters>();
  @Input() public searchMonitor: ActionMonitor;
  @Input() public gameTitle: GameTitleCodeName;
  @Input() public rejectionFn: (identity: AugmentedCompositeIdentity) => string | null;
  @Input() public foundFn: (identity: AugmentedCompositeIdentity) => IdentityResultAlpha | null;

  public ugcType = keys(UgcType).filter(type => type !== UgcType.Unknown) as UgcType[];

  public formControls = {
    ugcType: new FormControl(UgcType.Livery, Validators.required),
    makeModelInput: new FormControl(null),
    keywords: new FormControl(''),
    isFeatured: new FormControl(false, Validators.required),
    identity: new FormControl(null),
  };

  /** UGC filters form group. */
  public formGroup: FormGroup = new FormGroup(this.formControls);
  public stateGroupOptions$: Observable<MakeModelFilterGroup[]>;
  public makeModelFilterGroups: MakeModelFilterGroup[];

  constructor() {
    super();
  }

  /** Emits new ugc filter parameters. */
  public emitFilterParameters(): void {
    const carFilter = this.formControls.makeModelInput.value as DetailedCar;
    let carId: BigNumber = undefined;

    if (!!carFilter) {
      carId = carFilter?.id;
    }

    const parameters = {
      xuid: (this.formControls.identity.value as IdentityResultAlpha)?.xuid,
      ugcType: this.formControls.ugcType.value,
      carId: carId,
      keywords: this.formControls.keywords.value,
      isFeatured: this.formControls.isFeatured.value,
    } as UgcSearchFilters;

    this.changes.emit(parameters);
  }

  /** Clears the keyword input and outputs the updated search filters */
  public clearKeyword(): void {
    this.formControls.keywords.setValue(null);
  }

  /** Player identity selected */
  public playerIdentityFound(newIdentity: AugmentedCompositeIdentity): void {
    const titleSpecificIdentity = this.foundFn(newIdentity);

    this.formControls.identity.setValue(titleSpecificIdentity);
  }
}
